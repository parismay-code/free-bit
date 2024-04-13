<?php

namespace App\Repositories\Contracts;

use App\Models\Order;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;

interface OrderRepositoryContract
{
    public function all(Request $request): array;

    public function getByUser(Request $request, User $user): array;

    public function getCurrentByUser(User $user): Order|null;

    public function getLatestByUser(User $user): array;

    public function getByOrganization(Request $request, Organization $organization): array;

    public function getLatestByOrganization(Organization $organization): array;

    public function create(array $data, User $user, Organization $organization): array;

    public function update(array $data, Order $order, Organization $organization): array;
}
