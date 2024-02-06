<?php

namespace App\Http\Resources;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Ingredient */
class FullIngredientResource extends JsonResource
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
            'cost' => $this->cost,
            'count' => $this->pivot->count ?? 0,
            'storage' => $this->storage,
            'organization' => new OrganizationResource($this->organization),
            'products' => ['data' => ProductResource::collection($this->products)],
        ];
    }
}
