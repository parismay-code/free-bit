<?php

namespace App\Repositories;

use App\Models\Role;
use App\Models\User;
use App\Repositories\Contracts\RoleRepositoryContract;

class RoleRepository implements RoleRepositoryContract
{
    public function all(): array
    {
        return Role::all();
    }

    public function create(array $data): array
    {
        $role = Role::create($data);

        if (!$role) {
            return [null, false];
        }

        return [$role, true];
    }

    public function update(Role $role, array $data): array
    {
        if (!$role->update($data)) {
            return [null, false];
        }

        return [$role, true];
    }

    private function roleExists(User $user, Role $role): bool
    {
        return $user->roles()->where('id', $role->id)->exists();
    }

    public function attach(Role $role, User $user): bool
    {
        if ($this->roleExists($user, $role)) {
            return true;
        }

        $user->roles()->attach($role->id);

        return $this->roleExists($user, $role);
    }

    public function detach(Role $role, User $user): bool
    {
        if (!$this->roleExists($user, $role)) {
            return true;
        }

        $user->roles()->detach($role->id);

        return !$this->roleExists($user, $role);
    }
}
