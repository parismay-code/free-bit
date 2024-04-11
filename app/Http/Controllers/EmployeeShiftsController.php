<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeShiftRequest;
use App\Http\Resources\OrganizationShiftResource;
use App\Models\EmployeeShift;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeeShiftsController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        if ($request->user()->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        return response(['data' => OrganizationShiftResource::collection($organization->shifts)]);
    }

    public function get(Request $request, Organization $organization, User $user): Response
    {
        if ($request->user()->organization()->isNot($organization) || $user->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        return response(['data' => OrganizationShiftResource::collection($user->shifts)]);
    }

    public function create(EmployeeShiftRequest $request, Organization $organization, User $user): Response
    {
        if ($user->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $shift = $user->shifts()->create($data);

        $status = $shift->organization()->associate($organization)->save();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new OrganizationShiftResource($shift));
    }

    public function update(EmployeeShiftRequest $request, Organization $organization, User $user, EmployeeShift $shift): Response
    {
        if ($shift->organization()->isNot($organization) || $shift->employee()->isNot($user)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $status = $shift->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new OrganizationShiftResource($shift));
    }

    public function delete(Request $request, Organization $organization, User $user, EmployeeShift $shift): Response
    {
        if ($shift->organization()->isNot($organization) || $shift->employee()->isNot($user)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $shift->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }
}
