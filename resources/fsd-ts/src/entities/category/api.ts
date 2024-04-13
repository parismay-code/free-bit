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
            url: baseUrl(`/categories/organization/${organizationId}`),
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
    categoryId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/categories/${categoryId}`),
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
            url: baseUrl(`/categories/organization/${params.organizationId}`),
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
    categoryId: number;
    category: CategoryDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/categories/${params.categoryId}`),
            method: 'PATCH',
            body: JSON.stringify(params.category),
        },
        response: {
            contract: zodContract(CategorySchema),
            mapData: defaultMap<Category>,
        },
    });
}

export async function deleteCategoryMutation(params: { categoryId: number }) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/categories/${params.categoryId}`),
            method: 'DELETE',
        },
    });
}
