<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganizationRequest;
use App\Http\Resources\OrganizationCollection;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Repositories\Contracts\OrganizationRepositoryContract;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrganizationsController extends Controller
{
    public function __construct(private readonly OrganizationRepositoryContract $organizationRepository)
    {
    }

    public function getAll(Request $request): Response
    {
        $organizations = $this->organizationRepository->all($request);

        return response(new OrganizationCollection($organizations));
    }

    public function get(Request $request, Organization $organization): Response
    {
        return response(new OrganizationResource($organization));
    }

    public function create(OrganizationRequest $request): Response
    {
        $ownerUid = $request->safe()->only(['owner_uid'])['owner_uid'];

        $data = $request->safe()->except(['owner_uid']);

        $avatar = $request->file('avatar');
        $banner = $request->file('banner');

        [$organization, $success] = $this->organizationRepository->create($data, $ownerUid, $avatar, $banner);

        if (!$success) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new OrganizationResource($organization));
    }

    public function update(OrganizationRequest $request, Organization $organization): Response
    {
        $ownerUid = $request->safe()->only(['owner_uid'])['owner_uid'];

        $data = $request->safe()->except(['owner_uid']);

        $avatar = $request->file('avatar');
        $banner = $request->file('banner');

        [$organization, $success] = $this->organizationRepository->update($organization, $data, $ownerUid, $avatar, $banner);

        if (!$success) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new OrganizationResource($organization));
    }

    public function delete(Request $request, Organization $organization): Response
    {
        if (!$organization->delete()) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }
}
