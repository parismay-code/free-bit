import { baseUrl } from '~shared/api';
import { CollectionSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Collection } from '~shared/types';
import { IngredientSchema } from './contracts';
import { Ingredient, IngredientDto } from './types';

export async function getAllIngredientsQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/organizations/${organizationId}/ingredients`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(IngredientSchema)),
            mapData: defaultMap<Collection<Ingredient>>,
        },
        abort: signal,
    });
}

export async function getIngredientQuery(
    organizationId: number,
    ingredientId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(
                `/organizations/${organizationId}/ingredients/${ingredientId}`,
            ),
            method: 'GET',
        },
        response: {
            contract: zodContract(IngredientSchema),
            mapData: defaultMap<Ingredient>,
        },
        abort: signal,
    });
}

export async function createIngredientMutation(params: {
    organizationId: number;
    ingredient: IngredientDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/organizations/${params.organizationId}/ingredients`),
            method: 'POST',
            body: JSON.stringify(params.ingredient),
        },
        response: {
            contract: zodContract(IngredientSchema),
            mapData: defaultMap<Ingredient>,
        },
    });
}

export async function updateIngredientMutation(params: {
    organizationId: number;
    ingredientId: number;
    ingredient: IngredientDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/ingredients/${params.ingredientId}`,
            ),
            method: 'PATCH',
            body: JSON.stringify(params.ingredient),
        },
        response: {
            contract: zodContract(IngredientSchema),
            mapData: defaultMap<Ingredient>,
        },
    });
}

export async function deleteIngredientMutation(params: {
    organizationId: number;
    ingredientId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/ingredients/${params.ingredientId}`,
            ),
            method: 'DELETE',
        },
    });
}

export async function attachProductIngredientMutation(params: {
    organizationId: number;
    productId: number;
    ingredientId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/products/${params.productId}/ingredients/${params.ingredientId}/attach`,
            ),
            method: 'POST',
        },
    });
}

export async function detachProductIngredientMutation(params: {
    organizationId: number;
    productId: number;
    ingredientId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/products/${params.productId}/ingredients/${params.ingredientId}/detach`,
            ),
            method: 'POST',
        },
    });
}
