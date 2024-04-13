import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Paginated } from '~shared/types';
import {
    createProductMutation,
    deleteProductMutation,
    getProductQuery,
    getProductsByCategoryQuery,
    getProductsByOrganizationQuery,
    updateProductMutation,
} from './api';
import { Product } from './types';

const keys = {
    root: () => ['product'] as const,
    getByOrganization: (organizationId: number) =>
        [...keys.root(), 'organization', organizationId] as const,
    getByCategory: (categoryId: number) =>
        [...keys.root(), 'category', categoryId] as const,
    get: (productId: number) => [...keys.root(), 'get', productId] as const,
    create: (organizationId: number, categoryId: number) =>
        [...keys.root(), 'create', organizationId, categoryId] as const,
    update: (productId: number) =>
        [...keys.root(), 'update', productId] as const,
    delete: (productId: number) =>
        [...keys.root(), 'delete', productId] as const,
};

export const organizationProductsService = {
    queryKey(organizationId: number) {
        return keys.getByOrganization(organizationId);
    },

    getCache(organizationId: number) {
        return queryClient.getQueryData<Paginated<Product>>(
            this.queryKey(organizationId),
        );
    },

    setCache(data: Paginated<Product> | null, organizationId: number) {
        return queryClient.setQueryData(this.queryKey(organizationId), data);
    },

    removeCache(organizationId: number) {
        return queryClient.removeQueries({
            queryKey: this.queryKey(organizationId),
        });
    },

    queryOptions(organizationId: number) {
        const queryKey = this.queryKey(organizationId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getProductsByOrganizationQuery(organizationId, signal),
            initialData: () => this.getCache(organizationId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(organizationId: number) {
        return queryClient.prefetchQuery(this.queryOptions(organizationId));
    },

    async ensureQueryData(organizationId: number) {
        return queryClient.ensureQueryData(this.queryOptions(organizationId));
    },
};

export const categoryProductsService = {
    queryKey(categoryId: number) {
        return keys.getByCategory(categoryId);
    },

    getCache(categoryId: number) {
        return queryClient.getQueryData<Paginated<Product>>(
            this.queryKey(categoryId),
        );
    },

    setCache(data: Paginated<Product> | null, categoryId: number) {
        return queryClient.setQueryData(this.queryKey(categoryId), data);
    },

    removeCache(categoryId: number) {
        return queryClient.removeQueries({
            queryKey: this.queryKey(categoryId),
        });
    },

    queryOptions(categoryId: number) {
        const queryKey = this.queryKey(categoryId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getProductsByCategoryQuery(categoryId, signal),
            initialData: () => this.getCache(categoryId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(categoryId: number) {
        return queryClient.prefetchQuery(this.queryOptions(categoryId));
    },

    async ensureQueryData(categoryId: number) {
        return queryClient.ensureQueryData(this.queryOptions(categoryId));
    },
};

export const productService = {
    queryKey(productId: number) {
        return keys.get(productId);
    },

    getCache(productId: number) {
        return queryClient.getQueryData<Product>(this.queryKey(productId));
    },

    setCache(data: Product | null, productId: number) {
        return queryClient.setQueryData(this.queryKey(productId), data);
    },

    removeCache(productId: number) {
        return queryClient.removeQueries({
            queryKey: this.queryKey(productId),
        });
    },

    queryOptions(productId: number) {
        const queryKey = this.queryKey(productId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) => getProductQuery(productId, signal),
            initialData: () => this.getCache(productId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(productId: number) {
        return queryClient.prefetchQuery(this.queryOptions(productId));
    },

    async ensureQueryData(productId: number) {
        return queryClient.ensureQueryData(this.queryOptions(productId));
    },
};

export function useCreateProductMutation(
    organizationId: number,
    categoryId: number,
) {
    return useMutation({
        mutationKey: keys.create(organizationId, categoryId),
        mutationFn: createProductMutation,
        onSuccess: async (product) => {
            productService.setCache(product, product.id);
        },
    });
}

export function useUpdateProductMutation(productId: number) {
    return useMutation({
        mutationKey: keys.update(productId),
        mutationFn: updateProductMutation,
        onSuccess: async (product) => {
            productService.setCache(product, productId);
        },
    });
}

export function useDeleteProductMutation(productId: number) {
    return useMutation({
        mutationKey: keys.delete(productId),
        mutationFn: deleteProductMutation,
        onSuccess: async () => {
            productService.setCache(null, productId);
            await queryClient.invalidateQueries();
        },
    });
}
