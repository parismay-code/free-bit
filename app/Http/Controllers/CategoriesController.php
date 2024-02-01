<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Http\Resources\Collection;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\FullCategoryResource;
use App\Models\Category;
use App\Models\Organization;
use Request;
use Symfony\Component\HttpFoundation\Response;

class CategoriesController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        return response(new Collection(CategoryResource::collection($organization->categories)));
    }

    public function get(Request $request, Organization $organization, Category $category): Response
    {
        if ($category->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        return response(['category' => new FullCategoryResource($category)]);
    }

    public function create(CategoryRequest $request, Organization $organization): Response
    {
        $data = $request->validated();

        $category = $organization->categories()->create($data);

        return response(['category' => new FullCategoryResource($category)]);
    }

    public function update(CategoryRequest $request, Organization $organization, Category $category): Response
    {
        if ($category->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        $status = $category->update($data);

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response(['category' => new FullCategoryResource($category)]);
    }

    public function delete(Request $request, Organization $organization, Category $category): Response
    {
        if ($category->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $status = $category->delete();

        if (!$status) {
            return response('', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response();
    }
}
