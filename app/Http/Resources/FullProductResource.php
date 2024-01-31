<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FullProductResource extends JsonResource
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
            'ingredients' => IngredientResource::collection($this->ingredients()),
            'price' => $this->price,
            'count' => $this->pivot->count ?? 0,
            'organization' => new OrganizationResource($this->organization()),
            'orders' => OrderResource::collection($this->orders()),
            'category' => new CategoryResource($this->category()),
        ];
    }
}
