<?php

namespace App\Http\Resources;

use Gate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IngredientResource extends JsonResource
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
            'count' => $this->pivot->count ?? 0,
            $this->mergeWhen(($request->user() && $request->user()->organization()->exists() && $request->user()->organization()->is($this->organization)) || Gate::allows('isManager'), [
                'cost' => $this->cost,
                'storage' => $this->storage,
            ]),
        ];
    }
}
