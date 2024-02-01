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
            'avatar' => $this->avatar,
            'roles' => new Collection(RoleResource::collection($this->roles)),
            'orders' => [
                'created' => new Collection(OrderResource::collection($this->orders)),
                'handled' => new Collection(OrderResource::collection($this->ordersHandled)),
                'delivered' => new Collection(OrderResource::collection($this->ordersDelivered)),
            ],
            'organization' => [
                'data' => new OrganizationResource($this->organization),
                'roles' => new Collection(OrganizationRoleResource::collection($this->organizationRoles)),
                'shifts' => new Collection(OrganizationShiftResource::collection($this->shifts)),
            ],
            'ownedOrganization' => new OrganizationResource($this->ownedOrganization),
        ];
    }
}
