<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Http\Request;

interface UserRepositoryContract
{
    public function all(Request $request): array;

    public function create(array $data): array;

    public function update(User $user, array $data, mixed $avatar, bool $sameUser): array;
}
