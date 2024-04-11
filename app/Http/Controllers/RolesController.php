<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RolesController extends Controller
{
    public function getAll(Request $request): Response
    {
        return response(['data' => RoleResource::collection(Role::all())]);
    }

    public function get(Request $request, Role $role): Response
    {
        return response(new RoleResource($role));
    }

    public function create(RoleRequest $request): Response
    {
        $data = $request->validated();

        $role = Role::create($data);

        return response(new RoleResource($role));
    }

    public function update(RoleRequest $request, Role $role): Response
    {
        $data = $request->validated();

        $status = $role->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new RoleResource($role));
    }

    public function delete(Request $request, Role $role): Response
    {
        $status = $role->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }

    public function attach(Request $request, User $user, Role $role): Response
    {
        if ($user->roles()->find($role->id)) {
            return response('');
        }

        $user->roles()->attach($role->id);

        return response('');
    }

    public function detach(Request $request, User $user, Role $role): Response
    {
        if (!$user->roles()->find($role->id)) {
            return response('');
        }

        $user->roles()->detach($role->id);

        return response('');
    }
}
