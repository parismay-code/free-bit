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
            'owner' => new UserResource($this->owner),
            'roles' => new Collection(OrganizationRoleResource::collection($this->roles)),
            'employees' => new Collection(UserResource::collection($this->employees)),
            'orders' => new Collection(OrderResource::collection($this->orders)),
            'categories' => new Collection(CategoryResource::collection($this->categories)),
            'products' => new Collection(ProductResource::collection($this->products)),
            'ingredients' => new Collection(IngredientResource::collection($this->ingredients)),
            'storage' => new Collection(IngredientResource::collection($this->storage)),
        ];
    }
}
