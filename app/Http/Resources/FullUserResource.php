<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FullUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'uid' => $this->uid,
            'email' => $this->email,
            'phone' => $this->phone,
            'roles' => RoleResource::collection($this->roles()),
            'orders' => [
                'created' => OrderResource::collection($this->ordersCreated()),
                'handled' => OrderResource::collection($this->ordersHandled()),
                'delivered' => OrderResource::collection($this->ordersDelivered()),
            ],
            'organization' => [
                'data' => new OrganizationResource($this->organization()),
                'roles' => OrganizationRoleResource::collection($this->organizationRoles()),
                'shifts' => OrganizationShiftResource::collection($this->shifts()),
            ],
            'ownedOrganization' => new OrganizationResource($this->ownedOrganization()),
        ];
    }
}
