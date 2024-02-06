<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Order */
class OrderResource extends JsonResource
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
            'status' => $this->status,
            'delivery' => $this->delivery,
            'courier' => new UserResource($this->courier),
            'employee' => new UserResource($this->employee),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
