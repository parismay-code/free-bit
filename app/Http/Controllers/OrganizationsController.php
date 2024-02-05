<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganizationRequest;
use App\Http\Resources\Collection;
use App\Http\Resources\FullOrganizationResource;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Models\User;
use Carbon\Carbon;
use Gate;
use Request;
use Storage;
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
        $avatarsPath = 'public/images/avatars/organizations/';
        $bannersPath = 'public/images/banners/';

        if ($user->ownedOrganization()->exists()) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->safe()->except(['avatar', 'banner']);

        $avatarUrl = null;
        $bannerUrl = null;

        if ($request->file('avatar')->isValid()) {
            $avatarFile = $request->file('avatar');
            $avatarName = (new Carbon())->format('Ymd_his') . '_' . $user->uid . '.' . $avatarFile->getClientOriginalExtension();

            $avatarFile->storeAs($avatarsPath, $avatarName);

            $avatarUrl = $avatarsPath . $avatarName;
        }

        if ($request->file('banner')->isValid()) {
            $bannerFile = $request->file('banner');
            $bannerName = (new Carbon())->format('Ymd_his') . '_' . $user->uid . '.' . $bannerFile->getClientOriginalExtension();

            $bannerFile->storeAs($bannersPath, $bannerName);

            $bannerUrl = $bannersPath . $bannerName;
        }

        /** @var Organization $organization */
        $organization = $user->ownedOrganization()->create([...$data, 'avatar' => $avatarUrl, 'banner' => $bannerUrl]);

        $user->organization()->associate($organization);

        $staffRole = $organization->roles()->create(['name' => 'staff', 'description' => 'Персонал', 'priority' => '1']);

        $ownerRole = $organization->roles()->create(['name' => 'owner', 'description' => 'Владелец заведения', 'priority' => '999']);

        $organization->roles()->createMany([
            ['name' => 'deputy', 'description' => 'Заместитель владельца заведения', 'priority' => '998'],
            ['name' => 'admin', 'description' => 'Администратор заведения', 'priority' => '997'],
            ['name' => 'manager', 'description' => 'Менеджер заведения', 'priority' => '996'],
        ]);

        $user->organizationRoles()->attach($staffRole->id);
        $user->organizationRoles()->attach($ownerRole->id);

        return response(['organization' => new FullOrganizationResource($organization)]);
    }

    public function update(OrganizationRequest $request, Organization $organization, User $user): Response
    {
        $avatarsPath = 'public/images/avatars/organizations/';
        $bannersPath = 'public/images/banners/';

        $data = $request->safe()->except(['avatar', 'banner']);

        $avatarUrl = null;
        $bannerUrl = null;

        if ($request->file('avatar')->isValid()) {
            if ($organization->avatar) {
                Storage::delete($avatarsPath . $organization->avatar);
            }

            $avatarFile = $request->file('avatar');
            $avatarName = (new Carbon())->format('Ymd_his') . '_' . $user->uid . '.' . $avatarFile->getClientOriginalExtension();

            $avatarFile->storeAs($avatarsPath, $avatarName);

            $avatarUrl = $avatarsPath . $avatarName;
        }

        if ($request->file('banner')->isValid()) {
            if ($organization->banner) {
                Storage::delete($bannersPath . $organization->banner);
            }

            $bannerFile = $request->file('banner');
            $bannerName = (new Carbon())->format('Ymd_his') . '_' . $user->uid . '.' . $bannerFile->getClientOriginalExtension();

            $bannerFile->storeAs($bannersPath, $bannerName);

            $bannerUrl = $bannersPath . $bannerName;
        }

        $status = $organization->update([...$data, 'avatar' => $avatarUrl, 'banner' => $bannerUrl]);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($organization->owner_id !== $user->id) {
            $ownerRole = $organization->roles()->where('name', 'owner')->first();

            $organization->owner->organizationRoles()->detach($ownerRole->id);

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
