<?php

namespace App\Http\Resources;

use App\Models\OrganizationRole;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin OrganizationRole */
class FullOrganizationRoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'priority' => $this->priority,
            'organization' => new OrganizationResource($this->organization),
            $this->mergeWhen(($request->user() && $request->user()->organization()->exists() && $request->user()->organization()->is($this->organization)) || Gate::allows('isManager'), [
                'employees' => new UserCollection($this->employees()->paginate(5)),
            ]),
        ];
    }
}
