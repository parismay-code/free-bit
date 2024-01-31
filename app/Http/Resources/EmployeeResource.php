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
            'roles' => RoleResource::collection($this->roles()),
            'orders' => OrderResource::collection($this->ordersHandled()),
            'organization' => [
                'data' => new OrganizationResource($this->organization()),
                'roles' => OrganizationRoleResource::collection($this->organizationRoles()),
                'shifts' => OrganizationShiftResource::collection($this->shifts()),
            ],
        ];
    }
}
