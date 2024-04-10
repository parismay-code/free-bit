import { baseUrl } from '~shared/api';
import { CollectionSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Collection } from '~shared/types';
import { CategorySchema } from './contracts';
import { Category, CategoryDto } from './types';

export async function getAllCategoriesQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/organizations/${organizationId}/categories`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(CategorySchema)),
            mapData: defaultMap<Collection<Category>>,
        },
        abort: signal,
    });
}

export async function getCategoryQuery(
    organizationId: number,
    categoryId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(
                `/organizations/${organizationId}/categories/${categoryId}`,
            ),
            method: 'GET',
        },
        response: {
            contract: zodContract(CategorySchema),
            mapData: defaultMap<Category>,
        },
        abort: signal,
    });
}

export async function createCategoryMutation(params: {
    organizationId: number;
    category: CategoryDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/organizations/${params.organizationId}/categories`),
            method: 'POST',
            body: JSON.stringify(params.category),
        },
        response: {
            contract: zodContract(CategorySchema),
            mapData: defaultMap<Category>,
        },
    });
}

export async function updateCategoryMutation(params: {
    organizationId: number;
    categoryId: number;
    category: CategoryDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/categories/${params.categoryId}`,
            ),
            method: 'PATCH',
            body: JSON.stringify(params.category),
        },
        response: {
            contract: zodContract(CategorySchema),
            mapData: defaultMap<Category>,
        },
    });
}

export async function deleteCategoryMutation(params: {
    organizationId: number;
    categoryId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/categories/${params.categoryId}`,
            ),
            method: 'DELETE',
        },
    });
}
