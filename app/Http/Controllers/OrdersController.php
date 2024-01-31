<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Http\Resources\FullOrderResource;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Organization;
use App\Models\User;
use Request;
use Symfony\Component\HttpFoundation\Response;

class OrdersController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        return response(OrderResource::collection($organization->orders()));
    }

    public function get(Request $request, Organization $organization, Order $order): Response
    {
        if ($order->organization_id !== $organization->id) {
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
        if ($order->organization_id !== $organization->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $status = $order->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(['order' => new FullOrderResource($order)]);
    }

    public function delete(Request $request, Organization $organization, Order $order): Response
    {
        if ($order->organization_id !== $organization->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $order->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response();
    }

    public function associateCourier(Request $request, Organization $organization, Order $order, User $user): Response
    {
        if ($order->organization_id !== $organization->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $order->courier()->associate($user)->save();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response();
    }

    public function associateEmployee(Request $request, Organization $organization, Order $order, User $user): Response
    {
        if ($order->organization_id !== $organization->id || $user->organization_id !== $organization->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $order->employee()->associate($user)->save();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response();
    }
}
