<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\Collection;
use App\Http\Resources\FullRoleResource;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Models\User;
use Request;
use Symfony\Component\HttpFoundation\Response;

class RolesController extends Controller
{
    public function getAll(Request $request): Response
    {
        return response(new Collection(RoleResource::collection(Role::all())));
    }

    public function get(Request $request, Role $role): Response
    {
        return response(['role' => new FullRoleResource($role)]);
    }

    public function create(RoleRequest $request): Response
    {
        $data = $request->validated();

        $role = Role::create($data);

        return response(['role' => new FullRoleResource($role)]);
    }

    public function update(RoleRequest $request, Role $role): Response
    {
        $data = $request->validated();

        $status = $role->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(['role' => new FullRoleResource($role)]);
    }

    public function delete(Request $request, Role $role): Response
    {
        $status = $role->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response();
    }

    public function attach(Request $request, User $user, Role $role): Response
    {
        if ($user->roles()->find($role->id)->exists()) {
            return response();
        }

        $user->roles()->attach($role->id);

        return response();
    }

    public function detach(Request $request, User $user, Role $role): Response
    {
        if (!$user->roles()->find($role->id)->exists()) {
            return response();
        }

        $user->roles()->detach($role->id);

        return response();
    }
}
