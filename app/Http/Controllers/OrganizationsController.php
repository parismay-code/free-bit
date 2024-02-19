<?php

namespace App\Http\Controllers;

use App\Http\Filters\OrganizationsFilter;
use App\Http\Requests\OrganizationRequest;
use App\Http\Resources\FullOrganizationResource;
use App\Http\Resources\OrganizationCollection;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Storage;
use Symfony\Component\HttpFoundation\Response;

class OrganizationsController extends Controller
{
    public function getAll(Request $request): Response
    {
        $organizations = Organization::filter(new OrganizationsFilter($request))->paginate(10);

        return response(new OrganizationCollection($organizations));
    }

    public function get(Request $request, Organization $organization): Response
    {
        return response(['organization' => new FullOrganizationResource($organization)]);
    }

    public function create(OrganizationRequest $request): Response
    {
        $ownerUid = $request->safe()->only(['owner_uid'])['owner_uid'];

        $user = User::where('uid', strtoupper($ownerUid))->first();

        $avatarsPath = 'public/images/avatars/organizations/';
        $bannersPath = 'public/images/banners/';

        if ($user->ownedOrganization()->exists()) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->safe()->except(['avatar', 'banner', 'owner_uid']);

        $avatarUrl = null;
        $bannerUrl = null;

        if (!empty($request->file('avatar')) && $request->file('avatar')->isValid()) {
            $avatarFile = $request->file('avatar');
            $avatarName = (new Carbon())->format('Ymd_his') . '_' . $user->uid . '.' . $avatarFile->getClientOriginalExtension();

            $avatarFile->storeAs($avatarsPath, $avatarName);

            $avatarUrl = $avatarsPath . $avatarName;
        }

        if (!empty($request->file('banner')) && $request->file('banner')->isValid()) {
            $bannerFile = $request->file('banner');
            $bannerName = (new Carbon())->format('Ymd_his') . '_' . $user->uid . '.' . $bannerFile->getClientOriginalExtension();

            $bannerFile->storeAs($bannersPath, $bannerName);

            $bannerUrl = $bannersPath . $bannerName;
        }

        /** @var Organization $organization */
        $organization = $user->ownedOrganization()->create([...$data, 'avatar' => $avatarUrl, 'banner' => $bannerUrl]);

        $user->organization()->associate($organization)->save();

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

    public function update(OrganizationRequest $request, Organization $organization): Response
    {
        $ownerUid = $request->safe()->only(['owner_uid'])['owner_uid'];

        $user = User::where('uid', strtoupper($ownerUid))->first();

        $avatarsPath = 'public/images/avatars/organizations/';
        $bannersPath = 'public/images/banners/';

        $data = $request->safe()->except(['avatar', 'banner']);

        $avatarUrl = null;
        $bannerUrl = null;

        if (!empty($request->file('avatar')) && $request->file('avatar')->isValid()) {
            if ($organization->avatar) {
                Storage::delete($avatarsPath . $organization->avatar);
            }

            $avatarFile = $request->file('avatar');
            $avatarName = (new Carbon())->format('Ymd_his') . '_' . $user->uid . '.' . $avatarFile->getClientOriginalExtension();

            $avatarFile->storeAs($avatarsPath, $avatarName);

            $avatarUrl = $avatarsPath . $avatarName;
        }

        if (!empty($request->file('banner')) && $request->file('banner')->isValid()) {
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

        return response('');
    }
}
