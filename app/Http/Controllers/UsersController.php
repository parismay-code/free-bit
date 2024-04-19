<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryContract;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UsersController extends Controller
{
    public function __construct(private readonly UserRepositoryContract $userRepository)
    {
    }

    public function getAll(Request $request): Response
    {
        $users = $this->userRepository->all($request);

        return response(new UserCollection($users));
    }

    public function get(Request $request, User $user): Response
    {
        return response(new UserResource($user));
    }

    public function update(UserRequest $request, User $user): Response
    {
        $sameUser = $request->user()->is($user);

        if (!$sameUser && !Gate::allows('isAdmin')) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $avatar = $request->file('avatar');

        [$user, $success] = $this->userRepository->update($user, $data, $avatar, $sameUser);

        if (!$success) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new UserResource($user));
    }

    public function delete(Request $request, User $user): Response
    {
        if ($request->user()->isNot($user) && !Gate::allows('isAdmin')) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $user->tokens()->delete();

        $cookie = cookie()->forget('token');

        $user->delete();

        if ($request->user()->is($user)) {
            return response('')->withCookie($cookie);
        }

        return response('');
    }
}
