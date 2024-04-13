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

export async function getIngredientsByOrganizationQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/ingredients/organization/${organizationId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(IngredientSchema)),
            mapData: defaultMap<Collection<Ingredient>>,
        },
        abort: signal,
    });
}

export async function getIngredientsByProductQuery(
    productId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/ingredients/product/${productId}`),
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
    ingredientId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/ingredients/${ingredientId}`),
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
            url: baseUrl(`/ingredients/organization/${params.organizationId}`),
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
    ingredientId: number;
    ingredient: IngredientDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/ingredients/${params.ingredientId}`),
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
    ingredientId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/ingredients/${params.ingredientId}`),
            method: 'DELETE',
        },
    });
}

export async function attachProductIngredientMutation(params: {
    ingredientId: number;
    productId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/ingredients/${params.ingredientId}/product/${params.productId}/attach`,
            ),
            method: 'POST',
        },
    });
}

export async function detachProductIngredientMutation(params: {
    ingredientId: number;
    productId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/ingredients/${params.ingredientId}/product/${params.productId}/detach`,
            ),
            method: 'POST',
        },
    });
}
