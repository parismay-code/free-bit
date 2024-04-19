<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Repositories\Contracts\RoleRepositoryContract;
use App\Repositories\Contracts\UserRepositoryContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Log;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(
        private readonly UserRepositoryContract $userRepository,
        private readonly RoleRepositoryContract $roleRepository
    )
    {
    }

    public function register(RegisterRequest $request): Response
    {
        $data = $request->safe()->except(['password_confirmation']);

        [$user, $success] = $this->userRepository->create($data);

        if (!$success) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $role = Role::where('name', 'user')->first();

        if (!$role || !$this->roleRepository->attach($role, $user)) {
            $user->delete();

            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $cookie = cookie('token', $token, 60 * 24);

        return response(new UserResource($user))
            ->withCookie($cookie);
    }

    public function login(LoginRequest $request): Response
    {
        $data = $request->validated();

        $user = User::where('uid', $data['uid'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response('', Response::HTTP_UNAUTHORIZED);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $cookie = cookie('token', $token, 60 * 24);

        return response(new UserResource($user))
            ->withCookie($cookie);
    }

    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        $cookie = cookie()->forget('token');

        return response('')->withCookie($cookie);
    }

    public function user(Request $request): Response
    {
        return response(new UserResource($request->user()));
    }
}
