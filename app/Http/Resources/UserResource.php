<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Storage;

/** @mixin User */
class UserResource extends JsonResource
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
            'uid' => $this->uid,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar ? Storage::url($this->avatar) : null,
        ];
    }
}
