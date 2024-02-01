<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'uid' => $this->uid,
            'email' => $this->email,
            'phone' => $this->phone,
            'roles' => new Collection(RoleResource::collection($this->roles)),
            'orders' => new Collection(OrderResource::collection($this->ordersHandled)),
            'organization' => [
                'data' => new OrganizationResource($this->organization),
                'roles' => new Collection(OrganizationRoleResource::collection($this->organizationRoles)),
                'shifts' => new Collection(OrganizationShiftResource::collection($this->shifts)),
            ],
        ];
    }
}
