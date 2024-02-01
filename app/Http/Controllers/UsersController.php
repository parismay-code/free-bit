<?php

namespace App\Http\Controllers;

use App\Http\Resources\FullUserResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Collection;
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
}
