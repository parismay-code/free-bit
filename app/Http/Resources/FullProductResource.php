<?php

namespace App\Http\Resources;

use Gate;
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
            'ingredients' => new Collection(IngredientResource::collection($this->ingredients)),
            'price' => $this->price,
            'count' => $this->pivot->count ?? 0,
            'category' => new CategoryResource($this->category),
            'organization' => new OrganizationResource($this->organization),
            $this->mergeWhen(($request->user() && $request->user()->organization()->exists() && $request->user()->organization()->is($this->organization)) || Gate::allows('isManager'), [
                'orders' => new Collection(OrderResource::collection($this->orders)),
            ]),
        ];
    }
}
