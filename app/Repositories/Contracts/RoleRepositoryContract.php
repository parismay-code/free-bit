<?php

namespace App\Repositories\Contracts;

use App\Models\Role;
use App\Models\User;

interface RoleRepositoryContract
{
    public function all(): array;

    public function create(array $data): array;

    public function update(Role $role, array $data): array;

    public function attach(Role $role, User $user): bool;

    public function detach(Role $role, User $user): bool;
}
