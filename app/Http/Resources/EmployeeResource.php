<?php

namespace App\Http\Resources;

use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
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
            'roles' => ['data' => RoleResource::collection($this->roles)],
            $this->mergeWhen(($request->user() && $request->user()->organization()->exists() && $request->user()->organization()->is($this->organization)) || Gate::allows('isManager'), [
                'orders' => ['data' => OrderResource::collection($this->ordersHandled)],
                'organization' => [
                    'data' => new OrganizationResource($this->organization),
                    'roles' => ['data' => OrganizationRoleResource::collection($this->organizationRoles)],
                    $this->mergeWhen(Gate::allows('isOrganizationManager'), [
                        'shifts' => ['data' => OrganizationShiftResource::collection($this->shifts)],
                    ]),
                ],
            ]),
        ];
    }
}
