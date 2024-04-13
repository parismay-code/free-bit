import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Collection } from '~shared/types';
import {
    createCategoryMutation,
    deleteCategoryMutation,
    getAllCategoriesQuery,
    getCategoryQuery,
    updateCategoryMutation,
} from './api';
import { Category } from './types';

const keys = {
    root: () => ['category'] as const,
    getAll: (organizationId: number) =>
        [...keys.root(), 'all', organizationId] as const,
    get: (categoryId: number) => [...keys.root(), 'get', categoryId] as const,
    create: (organizationId: number) =>
        [...keys.root(), 'create', organizationId] as const,
    update: (categoryId: number) =>
        [...keys.root(), 'update', categoryId] as const,
    delete: (categoryId: number) =>
        [...keys.root(), 'delete', categoryId] as const,
};

export const allCategoriesService = {
    queryKey(organizationId: number) {
        return keys.getAll(organizationId);
    },

    getCache(organizationId: number) {
        return queryClient.getQueryData<Collection<Category>>(
            this.queryKey(organizationId),
        );
    },

    setCache(data: Collection<Category> | null, organizationId: number) {
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
                getAllCategoriesQuery(organizationId, signal),
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

export const categoryService = {
    queryKey(categoryId: number) {
        return keys.get(categoryId);
    },

    getCache(categoryId: number) {
        return queryClient.getQueryData<Category>(this.queryKey(categoryId));
    },

    setCache(data: Category | null, categoryId: number) {
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
            queryFn: async ({ signal }) => getCategoryQuery(categoryId, signal),
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

export function useCreateCategoryMutation(organizationId: number) {
    return useMutation({
        mutationKey: keys.create(organizationId),
        mutationFn: createCategoryMutation,
        onSuccess: async (category) => {
            categoryService.setCache(category, category.id);
        },
    });
}

export function useUpdateCategoryMutation(categoryId: number) {
    return useMutation({
        mutationKey: keys.update(categoryId),
        mutationFn: updateCategoryMutation,
        onSuccess: async (category) => {
            categoryService.setCache(category, categoryId);
        },
    });
}

export function useDeleteCategoryMutation(categoryId: number) {
    return useMutation({
        mutationKey: keys.delete(categoryId),
        mutationFn: deleteCategoryMutation,
        onSuccess: async () => {
            categoryService.setCache(null, categoryId);
            await queryClient.invalidateQueries();
        },
    });
}
