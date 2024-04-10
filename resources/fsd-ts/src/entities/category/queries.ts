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
    get: (organizationId: number, categoryId: number) =>
        [...keys.root(), 'get', organizationId, categoryId] as const,
    create: (organizationId: number) =>
        [...keys.root(), 'create', organizationId] as const,
    update: (organizationId: number, categoryId: number) =>
        [...keys.root(), 'update', organizationId, categoryId] as const,
    delete: (organizationId: number, categoryId: number) =>
        [...keys.root(), 'delete', organizationId, categoryId] as const,
};

export const categoryService = {
    allQueryKey: (organizationId: number) => keys.getAll(organizationId),
    categoryQueryKey: (organizationId: number, categoryId: number) =>
        keys.get(organizationId, categoryId),

    getCache: (organizationId: number, categoryId: number = -1) => {
        if (categoryId >= 0) {
            return queryClient.getQueryData<Category>(
                categoryService.categoryQueryKey(organizationId, categoryId),
            );
        }

        return queryClient.getQueryData<Collection<Category>>(
            categoryService.allQueryKey(organizationId),
        );
    },

    setCache: (
        data: Collection<Category> | Category | null,
        organizationId: number,
        categoryId: number = -1,
    ) => {
        const queryKey =
            categoryId >= 0
                ? categoryService.categoryQueryKey(organizationId, categoryId)
                : categoryService.allQueryKey(organizationId);

        return queryClient.setQueryData(queryKey, data);
    },

    removeCache: (organizationId: number, categoryId: number = -1) => {
        const queryKey =
            categoryId >= 0
                ? categoryService.categoryQueryKey(organizationId, categoryId)
                : categoryService.allQueryKey(organizationId);

        queryClient.removeQueries({ queryKey });
    },

    queryOptions: (organizationId: number, categoryId: number = -1) => {
        const isAllQuery = categoryId < 0;

        const queryKey = isAllQuery
            ? categoryService.allQueryKey(organizationId)
            : categoryService.categoryQueryKey(organizationId, categoryId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                isAllQuery
                    ? getAllCategoriesQuery(organizationId, signal)
                    : getCategoryQuery(organizationId, categoryId, signal),
            initialData: () =>
                categoryService.getCache(organizationId, categoryId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async (organizationId: number, categoryId: number = -1) =>
        queryClient.prefetchQuery(
            categoryService.queryOptions(organizationId, categoryId),
        ),

    ensureQueryData: async (organizationId: number, categoryId: number = -1) =>
        queryClient.ensureQueryData(
            categoryService.queryOptions(organizationId, categoryId),
        ),
};

export function useCreateCategoryMutation(organizationId: number) {
    return useMutation({
        mutationKey: keys.create(organizationId),
        mutationFn: createCategoryMutation,
        onSuccess: async (category) => {
            categoryService.setCache(category, organizationId, category.id);
        },
    });
}

export function useUpdateCategoryMutation(
    organizationId: number,
    categoryId: number,
) {
    return useMutation({
        mutationKey: keys.update(organizationId, categoryId),
        mutationFn: updateCategoryMutation,
        onSuccess: async (category) => {
            categoryService.setCache(category, organizationId, categoryId);
        },
    });
}

export function useDeleteCategoryMutation(
    organizationId: number,
    categoryId: number,
) {
    return useMutation({
        mutationKey: keys.delete(organizationId, categoryId),
        mutationFn: deleteCategoryMutation,
        onSettled: async () => {
            categoryService.setCache(null, organizationId, categoryId);
            await queryClient.invalidateQueries();
        },
    });
}
