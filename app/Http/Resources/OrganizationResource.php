<?php

namespace App\Http\Resources;

use App\Models\Organization;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Storage;

/** @mixin Organization */
class OrganizationResource extends JsonResource
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
            'avatar' => $this->avatar ? Storage::url($this->avatar) : null,
            'banner' => $this->banner ? Storage::url($this->banner) : null,
            'employees_count' => $this->employees()->count(),
            $this->mergeWhen(($request->user() && $request->user()->organization()->is(Organization::find($this->id))) || Gate::allows('isManager'), [
                'owner' => new UserResource($this->owner),
            ]),
        ];
    }
}
