<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FullOrganizationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'owner' => new UserResource($this->owner()),
            'employees' => UserResource::collection($this->employees()),
            'orders' => OrderResource::collection($this->orders()),
            'categories' => CategoryResource::collection($this->categories()),
            'products' => ProductResource::collection($this->products()),
            'ingredients' => IngredientResource::collection($this->ingredients()),
            'storage' => IngredientResource::collection($this->storage()),
        ];
    }
}
