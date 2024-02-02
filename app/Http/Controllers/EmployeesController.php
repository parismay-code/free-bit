<?php

namespace App\Http\Controllers;

use App\Http\Resources\Collection;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\UserResource;
use App\Models\Organization;
use App\Models\User;
use Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeesController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        return response(new Collection(UserResource::collection($organization->employees)));
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

        return response();
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

        return response();
    }
}
