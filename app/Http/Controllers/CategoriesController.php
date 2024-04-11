<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Organization;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CategoriesController extends Controller
{
    public function getAll(Request $request, Organization $organization): Response
    {
        return response(['data' => CategoryResource::collection($organization->categories)]);
    }

    public function get(Request $request, Organization $organization, Category $category): Response
    {
        if ($category->organization()->isNot($organization)) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        return response(new CategoryResource($category));
    }

    public function create(CategoryRequest $request, Organization $organization): Response
    {
        $data = $request->validated();

        $category = $organization->categories()->create($data);

        return response(new CategoryResource($category));
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

        return response(new CategoryResource($category));
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

        return response('');
    }
}
