import { baseUrl } from '~shared/api';
import { PaginatedSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Paginated } from '~shared/types';
import { ProductSchema } from './contracts';
import { Product, ProductDto } from './types';

export async function getProductsByOrganizationQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/products/organization/${organizationId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(PaginatedSchema(ProductSchema)),
            mapData: defaultMap<Paginated<Product>>,
        },
        abort: signal,
    });
}

export async function getProductsByCategoryQuery(
    categoryId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/products/category/${categoryId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(PaginatedSchema(ProductSchema)),
            mapData: defaultMap<Paginated<Product>>,
        },
        abort: signal,
    });
}

export async function getProductQuery(productId: number, signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/products/${productId}`),
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
                `/products/organization/${params.organizationId}/category/${params.categoryId}`,
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
    productId: number;
    product: ProductDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/products/${params.productId}`),
            method: 'PATCH',
            body: JSON.stringify(params.product),
        },
        response: {
            contract: zodContract(ProductSchema),
            mapData: defaultMap<Product>,
        },
    });
}

export async function deleteProductMutation(params: { productId: number }) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/products/${params.productId}`),
            method: 'DELETE',
        },
    });
}
