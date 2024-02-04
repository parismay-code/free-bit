<?php

namespace App\Http\Resources;

use Gate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Storage;

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
            $this->mergeWhen(Gate::allows('isManager'), [
                'owner' => new UserResource($this->owner),
            ]),
        ];
    }
}
