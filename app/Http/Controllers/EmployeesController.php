<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmployeeResource;
use App\Http\Resources\UserResource;
use App\Models\Organization;
use App\Models\OrganizationRole;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeesController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        return response(['data' => UserResource::collection($organization->employees)]);
    }

    public function get(Request $request, Organization $organization, User $user): Response
    {
        if ($user->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        return response(['employee' => new EmployeeResource($user)]);
    }

    public function associate(Request $request, Organization $organization, User $user): Response
    {
        if ($user->organization()->exists()) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $user->organization()->associate($organization)->save();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $staffRole = OrganizationRole::where('priority', '1')->first();

        $user->organizationRoles()->attach($staffRole->id);

        return response('');
    }

    public function dissociate(Request $request, Organization $organization, User $user): Response
    {
        if (!$user->organization()->exists() || $user->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $user->organization()->dissociate()->save();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        foreach ($user->organizationRoles as $role) {
            $user->organizationRoles()->detach($role->id);
        }

        return response('');
    }
}
