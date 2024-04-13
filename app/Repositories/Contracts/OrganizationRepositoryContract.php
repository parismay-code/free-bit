<?php

namespace App\Repositories\Contracts;

use App\Models\Organization;
use Illuminate\Http\Request;

interface OrganizationRepositoryContract
{
    public function all(Request $request): array;

    public function create(array $data, int $ownerUid, mixed $avatar, mixed $banner): array;

    public function update(Organization $organization, array $data, int $ownerUid, mixed $avatar, mixed $banner): array;
}
