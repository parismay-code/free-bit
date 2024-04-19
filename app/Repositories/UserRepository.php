<?php

namespace App\Repositories;

use App\Helpers\StorageHelpers;
use App\Http\Filters\UsersFilter;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryContract;
use Illuminate\Http\Request;

class UserRepository implements UserRepositoryContract
{
    private string $avatarsPath = 'public/images/avatars/users/';

    public function all(Request $request): array
    {
        return User::filter(new UsersFilter($request))->paginate(10);
    }

    public function create(array $data): array
    {
        $user = User::create($data);

        if (!$user) {
            return [null, false];
        }

        return [$user, true];
    }

    public function update(User $user, array $data, mixed $avatar, bool $sameUser): array
    {
        if (!empty($avatar) && $user->avatar) {
            StorageHelpers::removeFile($this->avatarsPath, $user->avatar);
        }

        [$avatarUrl, $success] = StorageHelpers::uploadFile($avatar, $this->avatarsPath, $user->uid);
        if (!$success) {
            return [null, false];
        }

        $user->name = !empty($data['name']) ? $data['name'] : $user->name;
        $user->uid = !empty($data['uid']) ? $data['uid'] : $user->uid;
        $user->email = !empty($data['email']) ? $data['email'] : $user->email;
        $user->phone = !empty($data['phone']) ? $data['phone'] : $user->phone;
        $user->avatar = $avatarUrl;

        if (!empty($data['new_password'])) {
            $user->password = $data['new_password'];
        }

        if ($user->isDirty('password') && !$sameUser) {
            $user->tokens()->delete();
        }

        if (!$user->save()) {
            StorageHelpers::removeFile($this->avatarsPath, $avatarUrl);

            return [null, false];
        }

        return [$user, true];
    }
}
