<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganizationRoleRequest;
use App\Http\Resources\OrganizationRoleResource;
use App\Models\Organization;
use App\Models\OrganizationRole;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeeRolesController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        return response(['data' => OrganizationRoleResource::collection($organization->roles)]);
    }

    public function get(Request $request, Organization $organization, OrganizationRole $organizationRole): Response
    {
        if ($organizationRole->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        return response(new OrganizationRoleResource($organizationRole));
    }

    public function create(OrganizationRoleRequest $request, Organization $organization): Response
    {
        $data = $request->validated();

        $organizationRole = $organization->roles()->create($data);

        return response(new OrganizationRoleResource($organizationRole));
    }

    public function update(OrganizationRoleRequest $request, Organization $organization, OrganizationRole $organizationRole): Response
    {
        if ($organizationRole->organization()->isNot($organization) || ($organizationRole->priority >= 900 && !Gate::allows('isAdmin'))) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $status = $organizationRole->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new OrganizationRoleResource($organizationRole));
    }

    public function delete(Request $request, Organization $organization, OrganizationRole $organizationRole): Response
    {
        if ($organizationRole->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $organizationRole->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }

    public function attach(Request $request, Organization $organization, User $user, OrganizationRole $organizationRole): Response
    {
        if ($organizationRole->organization()->isNot($organization) || $user->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        if ($user->organizationRoles()->find($organizationRole->id)) {
            return response('');
        }

        $user->organizationRoles()->attach($organizationRole->id);

        return response('');
    }

    public function detach(Request $request, Organization $organization, User $user, OrganizationRole $organizationRole): Response
    {
        if ($organizationRole->organization()->isNot($organization) || $user->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        if (!$user->organizationRoles()->find($organizationRole->id)) {
            return response('');
        }

        $user->organizationRoles()->detach($organizationRole->id);

        return response('');
    }
}
