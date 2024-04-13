<?php

namespace App\Repositories;

use App\Enums\OrderStatuses;
use App\Http\Filters\OrdersFilter;
use App\Models\Order;
use App\Models\Organization;
use App\Models\User;
use App\Repositories\Contracts\OrderRepositoryContract;
use Gate;
use Illuminate\Http\Request;

class OrderRepository implements OrderRepositoryContract
{
    public function all(Request $request): array
    {
        return Order::filter(new OrdersFilter($request))->paginate(10);
    }

    public function getByUser(Request $request, User $user): array
    {
        return $user->orders()->filter(new OrdersFilter($request))->paginate(10);
    }

    public function getCurrentByUser(User $user): Order|null
    {
        $statuses = [OrderStatuses::CREATED->value, OrderStatuses::ACCEPTED->value, OrderStatuses::COOKING->value, OrderStatuses::DELIVERING->value];

        return $user->orders()->latest('created_at')->whereIn('status', $statuses, 'or')->first();
    }

    public function getLatestByUser(User $user): array
    {
        return $user->orders()->latest('created_at')->limit(10)->get();
    }

    public function getByOrganization(Request $request, Organization $organization): array
    {
        return $organization->orders()->filter(new OrdersFilter($request))->paginate(10);
    }

    public function getLatestByOrganization(Organization $organization): array
    {
        return $organization->orders()->latest('created_at')->limit(10)->get();
    }

    public function create(array $data, User $user, Organization $organization): array
    {
        $order = $user->orders()->create($data);

        $success = $order->organization()->associate($organization)->save();

        return [$order, $success];
    }

    public function update(array $data, Order $order, Organization $organization): array
    {
        if (!Gate::allows('updateOrder', [$order, $data['status']])) {
            return [null, false];
        }

        $order->status = $data['status'];
        $order->delivery = $data['delivery'];

        if ($order->isDirty('status')) {
            if ($order->status === OrderStatuses::COOKING) {
                foreach ($order->products as $product) {
                    foreach ($product->ingredients as $ingredient) {
                        $organizationIngredient = $organization->ingredients()->find($ingredient->id)->first();

                        $organizationIngredient->storage -= $ingredient->pivot->count;
                        $organizationIngredient->save();
                    }
                }
            } else if ($order->getOriginal('status') !== OrderStatuses::CREATED && in_array($order->status, [
                    OrderStatuses::CLOSED_BY_CLIENT,
                    OrderStatuses::CLOSED_BY_ORGANIZATION,
                    OrderStatuses::CLOSED_BY_ADMINISTRATION
                ])) {
                foreach ($order->products as $product) {
                    foreach ($product->ingredients as $ingredient) {
                        $organizationIngredient = $organization->ingredients()->find($ingredient->id)->first();

                        $organizationIngredient->storage += $ingredient->pivot->count;
                        $organizationIngredient->save();
                    }
                }
            }
        }

        return [$order, $order->save()];
    }
}
