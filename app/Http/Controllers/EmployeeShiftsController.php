<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeShiftRequest;
use App\Http\Resources\OrganizationShiftResource;
use App\Models\EmployeeShift;
use App\Models\Organization;
use App\Models\User;
use Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeeShiftsController extends Controller
{
    public function create(EmployeeShiftRequest $request, Organization $organization, User $user): Response
    {
        if ($user->organization_id !== $organization->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $shift = $user->shifts()->create($data);

        $status = $shift->organization()->associate($organization)->save();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(['shift' => new OrganizationShiftResource($shift)]);
    }

    public function update(EmployeeShiftRequest $request, Organization $organization, User $user, EmployeeShift $shift): Response
    {
        if ($shift->organization_id !== $organization->id || $shift->user_id !== $user->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $status = $shift->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(['shift' => new OrganizationShiftResource($shift)]);
    }

    public function delete(Request $request, Organization $organization, User $user, EmployeeShift $shift): Response
    {
        if ($shift->organization_id !== $organization->id || $shift->user_id !== $user->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $shift->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response();
    }
}
