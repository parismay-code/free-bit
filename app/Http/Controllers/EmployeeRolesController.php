<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganizationRoleRequest;
use App\Http\Resources\FullOrganizationRoleResource;
use App\Http\Resources\OrganizationRoleResource;
use App\Models\Organization;
use App\Models\OrganizationRole;
use App\Models\User;
use Illuminate\Support\Collection;
use Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeeRolesController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        return response(new Collection(OrganizationRoleResource::collection($organization->roles)));
    }

    public function get(Request $request, Organization $organization, OrganizationRole $role): Response
    {
        if ($role->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        return response(['role' => new FullOrganizationRoleResource($role)]);
    }

    public function create(OrganizationRoleRequest $request, Organization $organization): Response
    {
        $data = $request->validated();

        $role = $organization->roles()->create($data);

        return response(['role' => new FullOrganizationRoleResource($role)]);
    }

    public function update(OrganizationRoleRequest $request, Organization $organization, OrganizationRole $role): Response
    {
        if ($role->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $status = $role->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(['role' => new FullOrganizationRoleResource($role)]);
    }

    public function delete(Request $request, Organization $organization, OrganizationRole $role): Response
    {
        if ($role->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $role->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response();
    }

    public function attach(Request $request, Organization $organization, User $user, OrganizationRole $role): Response
    {
        if ($role->organization()->isNot($organization) || $user->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        if ($user->organizationRoles()->find($role->id)->exists()) {
            return response();
        }

        $user->organizationRoles()->attach($role->id);

        return response();
    }

    public function detach(Request $request, Organization $organization, User $user, OrganizationRole $role): Response
    {
        if ($role->organization()->isNot($organization) || $user->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        if (!$user->organizationRoles()->find($role->id)->exists()) {
            return response();
        }

        $user->organizationRoles()->detach($role->id);

        return response();
    }
}
