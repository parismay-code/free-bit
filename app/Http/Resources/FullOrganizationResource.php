<?php

namespace App\Http\Resources;

use Gate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Storage;

class FullOrganizationResource extends JsonResource
{
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
            $this->mergeWhen(($request->user() && $request->user()->organization()->exists() && $request->user()->organization()->is($this)) || Gate::allows('isManager'), [
                'roles' => new Collection(OrganizationRoleResource::collection($this->roles)),
                'employees' => new Collection(UserResource::collection($this->employees)),
                'orders' => new Collection(OrderResource::collection($this->orders)),
                'categories' => new Collection(CategoryResource::collection($this->categories)),
                'products' => new Collection(ProductResource::collection($this->products)),
                'ingredients' => new Collection(IngredientResource::collection($this->ingredients)),
            ]),
        ];
    }
}
