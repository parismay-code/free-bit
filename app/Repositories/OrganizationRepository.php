<?php

namespace App\Repositories;

use App\Helpers\StorageHelpers;
use App\Http\Filters\OrganizationsFilter;
use App\Models\Organization;
use App\Models\User;
use App\Repositories\Contracts\OrganizationRepositoryContract;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class OrganizationRepository implements OrganizationRepositoryContract
{
    private string $avatarsPath = 'public/images/avatars/organizations/';
    private string $bannersPath = 'public/images/banners/';

    public function all(Request $request): array
    {
        return Organization::filter(new OrganizationsFilter($request))->paginate(10);
    }

    /**
     * @param array $data
     * @param int $ownerUid
     * @param UploadedFile | UploadedFile[] | array | null $avatar
     * @param UploadedFile | UploadedFile[] | array | null $banner
     * @return array
     */
    public function create(array $data, int $ownerUid, mixed $avatar, mixed $banner): array
    {
        $user = User::where('uid', strtoupper($ownerUid))->first();

        if ($user->ownedOrganization()->exists()) {
            return [null, false];
        }

        [$avatarUrl, $success] = StorageHelpers::uploadFile($avatar, $this->avatarsPath, $user->uid);
        if (!$success) {
            return [null, false];
        }

        [$bannerUrl, $success] = StorageHelpers::uploadFile($banner, $this->bannersPath, $user->uid);
        if (!$success) {
            return [null, false];
        }

        $organization = $user->ownedOrganization()->create([...$data, 'avatar' => $avatarUrl, 'banner' => $bannerUrl]);

        if (!$organization) {
            StorageHelpers::removeFile($this->avatarsPath, $avatarUrl);
            StorageHelpers::removeFile($this->bannersPath, $bannerUrl);
            return [null, false];
        }

        if (!$user->organization()->associate($organization)->save()) {
            $organization->delete();
            return [null, false];
        }

        $staffRole = $organization->roles()->create(['name' => 'staff', 'description' => 'Персонал', 'priority' => '1']);

        $ownerRole = $organization->roles()->create(['name' => 'owner', 'description' => 'Владелец заведения', 'priority' => '999']);

        $organization->roles()->createMany([
            ['name' => 'deputy', 'description' => 'Заместитель владельца заведения', 'priority' => '998'],
            ['name' => 'admin', 'description' => 'Администратор заведения', 'priority' => '997'],
            ['name' => 'manager', 'description' => 'Менеджер заведения', 'priority' => '996'],
        ]);

        $user->organizationRoles()->attach($staffRole->id);
        $user->organizationRoles()->attach($ownerRole->id);

        return [$organization, true];
    }

    /**
     * @param Organization $organization
     * @param array $data
     * @param int $ownerUid
     * @param UploadedFile | UploadedFile[] | array | null $avatar
     * @param UploadedFile | UploadedFile[] | array | null $banner
     * @return array
     */
    public function update(Organization $organization, array $data, int $ownerUid, mixed $avatar, mixed $banner): array
    {
        $user = User::where('uid', strtoupper($ownerUid))->first();

        if (!empty($avatar) && $organization->avatar) {
            StorageHelpers::removeFile($this->avatarsPath, $organization->avatar);
        }

        [$avatarUrl, $success] = StorageHelpers::uploadFile($avatar, $this->avatarsPath, $user->uid);
        if (!$success) {
            return [null, false];
        }

        if (!empty($banner) && $organization->banner) {
            StorageHelpers::removeFile($this->bannersPath, $organization->banner);
        }

        [$bannerUrl, $success] = StorageHelpers::uploadFile($banner, $this->bannersPath, $user->uid);
        if (!$success) {
            return [null, false];
        }

        if ($organization->owner_id !== $user->id) {
            $ownerRole = $organization->roles()->where('name', 'owner');

            if (!$ownerRole->exists()) {
                return [null, false];
            }

            $ownerRole = $ownerRole->first();

            $organization->owner->organizationRoles()->detach($ownerRole->id);

            if (!$organization->owner()->associate($user)->save()) {
                return [null, false];
            }
        }

        if (!$organization->update([...$data, 'avatar' => $avatarUrl, 'banner' => $bannerUrl])) {
            StorageHelpers::removeFile($this->avatarsPath, $avatarUrl);
            StorageHelpers::removeFile($this->bannersPath, $bannerUrl);

            return [null, false];
        }

        return [$organization, true];
    }
}
