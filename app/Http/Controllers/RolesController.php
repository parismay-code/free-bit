<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Models\User;
use App\Repositories\Contracts\RoleRepositoryContract;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RolesController extends Controller
{
    public function __construct(private readonly RoleRepositoryContract $roleRepository)
    {
    }

    public function getAll(Request $request): Response
    {
        $roles = $this->roleRepository->all();

        return response(['data' => RoleResource::collection($roles)]);
    }

    public function get(Request $request, Role $role): Response
    {
        return response(new RoleResource($role));
    }

    public function create(RoleRequest $request): Response
    {
        $data = $request->validated();

        [$role, $success] = $this->roleRepository->create($data);

        if (!$success) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new RoleResource($role));
    }

    public function update(RoleRequest $request, Role $role): Response
    {
        $data = $request->validated();

        [$role, $success] = $this->roleRepository->update($role, $data);

        if (!$success) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new RoleResource($role));
    }

    public function delete(Request $request, Role $role): Response
    {
        if (!$role->delete()) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }

    public function attach(Request $request, Role $role, User $user): Response
    {
        if (!$this->roleRepository->attach($role, $user)) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }

    public function detach(Request $request, Role $role, User $user): Response
    {
        if (!$this->roleRepository->detach($role, $user)) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }
}
