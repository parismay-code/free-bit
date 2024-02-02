<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganizationRequest;
use App\Http\Resources\Collection;
use App\Http\Resources\FullOrganizationResource;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Models\User;
use Gate;
use Request;
use Symfony\Component\HttpFoundation\Response;

class OrganizationsController extends Controller
{
    public function getAll(Request $request): Response
    {
        return response(new Collection(OrganizationResource::collection(Organization::all())));
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

        /** @var Organization $organization */
        $organization = $user->ownedOrganization()->create($data);

        $ownerRole = $organization->roles()->create(['name' => 'owner', 'description' => 'Владелец заведения', 'priority' => '999']);

        $organization->roles()->createMany([
            ['name' => 'deputy', 'description' => 'Заместитель владельца заведения', 'priority' => '998'],
            ['name' => 'admin', 'description' => 'Администратор заведения', 'priority' => '997'],
            ['name' => 'manager', 'description' => 'Менеджер заведения', 'priority' => '996'],
            ['name' => 'staff', 'description' => 'Персонал', 'priority' => '1'],
        ]);

        $user->organizationRoles()->attach($ownerRole->id);

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
