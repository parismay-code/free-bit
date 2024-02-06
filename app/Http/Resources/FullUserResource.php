<?php

namespace App\Http\Resources;

use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin User */
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
            'avatar' => $this->avatar ? Storage::url($this->avatar) : null,
            'roles' => ['data' => RoleResource::collection($this->roles)],
            $this->mergeWhen(($request->user() && $request->user()->is(User::find($this->id))) || Gate::allows('isManager'), [
                'orders' => [
                    'created' => ['data' => OrderResource::collection($this->orders)],
                    'handled' => ['data' => OrderResource::collection($this->ordersHandled)],
                    'delivered' => ['data' => OrderResource::collection($this->ordersDelivered)],
                ],
            ]),
            $this->mergeWhen(($request->user() && $request->user()->is(User::find($this->id))) || Gate::allows('isManager'), [
                'organization' => [
                    'data' => new OrganizationResource($this->organization),
                    'roles' => ['data' => OrganizationRoleResource::collection($this->organizationRoles)],
                    $this->mergeWhen(($this->shifts()->whereBetween('created_at', [now()->startOfWeek()->toDateString(), now()->endOfWeek()->toDateString()])->exists() > 0 && $request->user() && $request->user()->is(User::find($this->id))) || Gate::allows('isOrganizationManager'), [
                        'shifts' => ['data' => OrganizationShiftResource::collection($this->shifts()->whereBetween('created_at', [now()->startOfWeek()->toDateString(), now()->endOfWeek()->toDateString()])->get())],
                    ]),
                ],
            ]),
            'ownedOrganization' => new OrganizationResource($this->ownedOrganization),
        ];
    }
}
