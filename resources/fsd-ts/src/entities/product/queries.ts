import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Collection } from '~shared/types';
import {
    createProductMutation,
    deleteProductMutation,
    getAllProductsQuery,
    getProductQuery,
    updateProductMutation,
} from './api';
import { Product } from './types';

const keys = {
    root: () => ['Product'] as const,
    getAll: (organizationId: number) =>
        [...keys.root(), 'all', organizationId] as const,
    get: (organizationId: number, productId: number) =>
        [...keys.root(), 'get', organizationId, productId] as const,
    create: (organizationId: number, categoryId: number) =>
        [...keys.root(), 'create', organizationId, categoryId] as const,
    update: (organizationId: number, categoryId: number, productId: number) =>
        [
            ...keys.root(),
            'update',
            organizationId,
            categoryId,
            productId,
        ] as const,
    delete: (organizationId: number, productId: number) =>
        [...keys.root(), 'delete', organizationId, productId] as const,
};

export const productService = {
    allQueryKey: (organizationId: number) => keys.getAll(organizationId),
    productQueryKey: (organizationId: number, productId: number) =>
        keys.get(organizationId, productId),

    getCache: (organizationId: number, productId: number = -1) => {
        if (productId >= 0) {
            return queryClient.getQueryData<Product>(
                productService.productQueryKey(organizationId, productId),
            );
        }

        return queryClient.getQueryData<Collection<Product>>(
            productService.allQueryKey(organizationId),
        );
    },

    setCache: (
        data: Collection<Product> | Product | null,
        organizationId: number,
        productId: number = -1,
    ) => {
        const queryKey =
            productId >= 0
                ? productService.productQueryKey(organizationId, productId)
                : productService.allQueryKey(organizationId);

        return queryClient.setQueryData(queryKey, data);
    },

    removeCache: (organizationId: number, productId: number = -1) => {
        const queryKey =
            productId >= 0
                ? productService.productQueryKey(organizationId, productId)
                : productService.allQueryKey(organizationId);

        queryClient.removeQueries({ queryKey });
    },

    queryOptions: (organizationId: number, productId: number = -1) => {
        const isAllQuery = productId < 0;

        const queryKey = isAllQuery
            ? productService.allQueryKey(organizationId)
            : productService.productQueryKey(organizationId, productId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                isAllQuery
                    ? getAllProductsQuery(organizationId, signal)
                    : getProductQuery(organizationId, productId, signal),
            initialData: () =>
                productService.getCache(organizationId, productId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async (organizationId: number, productId: number = -1) =>
        queryClient.prefetchQuery(
            productService.queryOptions(organizationId, productId),
        ),

    ensureQueryData: async (organizationId: number, productId: number = -1) =>
        queryClient.ensureQueryData(
            productService.queryOptions(organizationId, productId),
        ),
};

export function useCreateProductMutation(
    organizationId: number,
    categoryId: number,
) {
    return useMutation({
        mutationKey: keys.create(organizationId, categoryId),
        mutationFn: createProductMutation,
        onSuccess: async (product) => {
            productService.setCache(product, organizationId, product.id);
        },
    });
}

export function useUpdateProductMutation(
    organizationId: number,
    categoryId: number,
    productId: number,
) {
    return useMutation({
        mutationKey: keys.update(organizationId, categoryId, productId),
        mutationFn: updateProductMutation,
        onSuccess: async (product) => {
            productService.setCache(product, organizationId, productId);
        },
    });
}

export function useDeleteProductMutation(
    organizationId: number,
    productId: number,
) {
    return useMutation({
        mutationKey: keys.delete(organizationId, productId),
        mutationFn: deleteProductMutation,
        onSuccess: async () => {
            productService.setCache(null, organizationId, productId);
            await queryClient.invalidateQueries();
        },
    });
}
