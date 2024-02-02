<?php

namespace App\Http\Resources;

use Gate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'avatar' => $this->avatar,
            'banner' => $this->banner,
            $this->mergeWhen(Gate::allows('isManager'), [
                'owner' => new UserResource($this->owner),
            ]),
        ];
    }
}
