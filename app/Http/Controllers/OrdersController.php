<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Organization;
use App\Models\User;
use App\Repositories\Contracts\OrderRepositoryContract;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrdersController extends Controller
{
    private OrderRepositoryContract $orderRepository;

    public function __construct(OrderRepositoryContract $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    public function getAll(Request $request): Response
    {
        $orders = $this->orderRepository->all($request);

        return response(new OrderCollection($orders));
    }

    public function getByOrganization(Request $request, Organization $organization): Response
    {
        $orders = $this->orderRepository->getByOrganization($request, $organization);

        return response(new OrderCollection($orders));
    }

    public function getByUser(Request $request, User $user): Response
    {
        $orders = $this->orderRepository->getByUser($request, $user);

        return response(new OrderCollection($orders));
    }

    public function get(Request $request, Order $order): Response
    {
        return response(new OrderResource($order));
    }

    public function getCurrentByUser(Request $request, User $user): Response
    {
        $order = $this->orderRepository->getCurrentByUser($user);

        if (!$order) {
            return response('', Response::HTTP_NOT_FOUND);
        }

        return response(new OrderResource($order));
    }

    public function getLatestByUser(Request $request, User $user): Response
    {
        $orders = $this->orderRepository->getLatestByUser($user);

        return response(['data' => OrderResource::collection($orders)]);
    }

    public function getLatestByOrganization(Request $request, Organization $organization): Response
    {
        $orders = $this->orderRepository->getLatestByOrganization($organization);

        return response(['data' => OrderResource::collection($orders)]);
    }

    public function create(OrderRequest $request, Organization $organization): Response
    {
        $data = $request->validated();

        [$order, $success] = $this->orderRepository->create($data, $request->user(), $organization);

        if (!$success) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new OrderResource($order));
    }

    public function update(OrderRequest $request, Order $order, Organization $organization): Response
    {
        $data = $request->validated();

        [$order, $success] = $this->orderRepository->update($data, $order, $organization);

        if (!$success) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new OrderResource($order));
    }

    public function delete(Request $request, Order $order): Response
    {
        if (!$order->delete()) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }

    public function associateCourier(Request $request, Order $order, User $user): Response
    {
        if (!$order->courier()->associate($user)->save()) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }

    public function associateEmployee(Request $request, Order $order, User $user): Response
    {
        if (!$order->employee()->associate($user)->save()) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }
}
