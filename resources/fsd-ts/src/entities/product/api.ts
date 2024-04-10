import { baseUrl } from '~shared/api';
import { CollectionSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Collection } from '~shared/types';
import { ProductSchema } from './contracts';
import { Product, ProductDto } from './types';

export async function getAllProductsQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/organizations/${organizationId}/products`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(ProductSchema)),
            mapData: defaultMap<Collection<Product>>,
        },
        abort: signal,
    });
}

export async function getProductQuery(
    organizationId: number,
    productId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(
                `/organizations/${organizationId}/products/${productId}`,
            ),
            method: 'GET',
        },
        response: {
            contract: zodContract(ProductSchema),
            mapData: defaultMap<Product>,
        },
        abort: signal,
    });
}

export async function createProductMutation(params: {
    organizationId: number;
    categoryId: number;
    product: ProductDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/categories/${params.categoryId}/products`,
            ),
            method: 'POST',
            body: JSON.stringify(params.product),
        },
        response: {
            contract: zodContract(ProductSchema),
            mapData: defaultMap<Product>,
        },
    });
}

export async function updateProductMutation(params: {
    organizationId: number;
    categoryId: number;
    productId: number;
    product: ProductDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/categories/${params.categoryId}/products/${params.productId}`,
            ),
            method: 'PATCH',
            body: JSON.stringify(params.product),
        },
        response: {
            contract: zodContract(ProductSchema),
            mapData: defaultMap<Product>,
        },
    });
}

export async function deleteProductMutation(params: {
    organizationId: number;
    productId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/products/${params.productId}`,
            ),
            method: 'DELETE',
        },
    });
}
