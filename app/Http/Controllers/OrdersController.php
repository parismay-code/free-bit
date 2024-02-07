<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatuses;
use App\Http\Filters\OrdersFilter;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\FullOrderResource;
use App\Http\Resources\OrderResource;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Organization;
use App\Models\User;
use Gate;
use Request;
use Symfony\Component\HttpFoundation\Response;

class OrdersController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        $orders = Order::filter(new OrdersFilter($request))->where('organization_id', $organization->id)->paginate(10);

        return response(['data' => OrderResource::collection($orders)]);
    }

    public function get(Request $request, Organization $organization, Order $order): Response
    {
        if ($order->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        return response(['order' => new FullOrderResource($order)]);
    }

    public function create(OrderRequest $request, Organization $organization): Response
    {
        $data = $request->validated();

        /** @var Order $order */
        $order = $request->user()->orders()->create($data);

        $status = $order->organization()->associate($organization)->save();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(['order' => new FullOrderResource($order)]);
    }

    public function update(OrderRequest $request, Organization $organization, Order $order): Response
    {
        $data = $request->validated();

        if ($order->organization()->isNot($organization) || !Gate::allows('updateOrder', [$order, $data['status']])) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $order->status = $data['status'];
        $order->delivery = $data['delivery'];

        if ($order->isDirty('status')) {
            if ($order->status === OrderStatuses::COOKING) {
                foreach ($order->products as $product) {
                    foreach ($product->ingredients as $ingredient) {
                        /** @var Ingredient $organizationIngredient */
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
                        /** @var Ingredient $organizationIngredient */
                        $organizationIngredient = $organization->ingredients()->find($ingredient->id)->first();

                        $organizationIngredient->storage += $ingredient->pivot->count;
                        $organizationIngredient->save();
                    }
                }
            }
        }

        if (!$order->save()) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(['order' => new FullOrderResource($order)]);
    }

    public function delete(Request $request, Organization $organization, Order $order): Response
    {
        if ($order->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $order->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }

    public function associateCourier(Request $request, Organization $organization, Order $order, User $user): Response
    {
        if ($order->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $order->courier()->associate($user)->save();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }

    public function associateEmployee(Request $request, Organization $organization, Order $order, User $user): Response
    {
        if ($order->organization()->isNot($organization) || $user->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $order->employee()->associate($user)->save();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }
}
