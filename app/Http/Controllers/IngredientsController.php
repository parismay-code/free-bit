<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttachWithCountRequest;
use App\Http\Requests\IngredientRequest;
use App\Http\Resources\FullIngredientResource;
use App\Http\Resources\IngredientResource;
use App\Models\Ingredient;
use App\Models\Organization;
use App\Models\Product;
use Request;
use Symfony\Component\HttpFoundation\Response;

class IngredientsController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        return response(IngredientResource::collection($organization->ingredients()));
    }

    public function get(Request $request, Organization $organization, Ingredient $ingredient): Response
    {
        if ($ingredient->organization_id !== $organization->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        return response(['ingredient' => new FullIngredientResource($ingredient)]);
    }

    public function create(IngredientRequest $request, Organization $organization): Response
    {
        $data = $request->validated();

        $ingredient = $organization->ingredients()->create($data);

        return response(['ingredient' => new FullIngredientResource($ingredient)]);
    }

    public function update(IngredientRequest $request, Organization $organization, Ingredient $ingredient): Response
    {
        if ($ingredient->organization_id !== $organization->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $status = $ingredient->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(['ingredient' => new FullIngredientResource($ingredient)]);
    }

    public function delete(Request $request, Organization $organization, Ingredient $ingredient): Response
    {
        if ($ingredient->organization_id !== $organization->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $ingredient->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response();
    }

    public function attach(AttachWithCountRequest $request, Organization $organization, Product $product, Ingredient $ingredient): Response
    {
        if ($product->organization_id !== $organization->id || $ingredient->organization_id !== $organization->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        if ($product->ingredients()->find($ingredient->id)->exists()) {
            $product->ingredients()->detach($ingredient->id);
        }

        $product->ingredients()->attach($ingredient->id, $data);

        return response();
    }

    public function detach(Request $request, Organization $organization, Product $product, Ingredient $ingredient): Response
    {
        if ($product->organization_id !== $organization->id || $ingredient->organization_id !== $organization->id) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        if (!$product->ingredients()->find($ingredient->id)->exists()) {
            return response();
        }

        $product->ingredients()->detach($ingredient->id);

        return response();
    }
}
