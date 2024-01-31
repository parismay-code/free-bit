<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganizationRequest;
use App\Http\Resources\FullOrganizationResource;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Models\User;
use Request;
use Symfony\Component\HttpFoundation\Response;

class OrganizationsController extends Controller
{
    public function getAll(Request $request): Response
    {
        return response(OrganizationResource::collection(Organization::all()));
    }

    public function get(Request $request, Organization $organization): Response
    {
        return response(['organization' => new FullOrganizationResource($organization)]);
    }

    public function create(OrganizationRequest $request, User $user): Response
    {
        if ($user->ownedOrganization()->exists()) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $organization = $user->ownedOrganization()->create($data);

        return response(['organization' => new FullOrganizationResource($organization)]);
    }

    public function update(OrganizationRequest $request, Organization $organization, User $user): Response
    {
        $data = $request->validated();

        $status = $organization->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($organization->owner_id !== $user->id) {
            $status = $organization->owner()->associate($user)->save();

            if (!$status) {
                return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        return response(['organization' => new FullOrganizationResource($organization)]);
    }

    public function delete(Request $request, Organization $organization): Response
    {
        $status = $organization->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response();
    }
}
