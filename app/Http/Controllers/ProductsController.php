<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Organization;
use App\Models\Product;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProductsController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        return response(['data' => ProductResource::collection($organization->products)]);
    }

    public function get(Request $request, Organization $organization, Product $product): Response
    {
        if ($product->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        return response(new ProductResource($product));
    }

    public function create(ProductRequest $request, Category $category, Organization $organization): Response
    {
        if ($category->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $product = $organization->products()->create($data);

        $status = $product->category()->associate($category)->save();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(new ProductResource($product));
    }

    public function update(ProductRequest $request, Organization $organization, Category $category, Product $product): Response
    {
        if ($product->organization()->isNot($organization) || $category->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $status = $product->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($product->category()->isNot($category)) {
            $status = $product->category()->associate($category)->save();

            if (!$status) {
                return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        return response(new ProductResource($product));
    }

    public function delete(Request $request, Organization $organization, Product $product): Response
    {
        if ($product->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $product->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response('');
    }
}
