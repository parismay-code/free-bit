<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\Collection;
use App\Http\Resources\FullUserResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Gate;
use Request;
use Symfony\Component\HttpFoundation\Response;

class UsersController extends Controller
{
    public function getAll(Request $request): Response
    {
        return response(new Collection(UserResource::collection(User::all())));
    }

    public function get(Request $request, User $user): Response
    {
        return response(['user' => new FullUserResource($user)]);
    }

    public function update(UserRequest $request, User $user): Response
    {
        if ($request->user()->isNot($user) && !Gate::allows('isAdmin')) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        if (!$user->update($data)) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(['user' => new FullUserResource($user)]);
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
            return response()->withCookie($cookie);
        }

        return response();
    }
}
