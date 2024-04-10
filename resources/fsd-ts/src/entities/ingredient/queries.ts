import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Collection } from '~shared/types';
import {
    attachProductIngredientMutation,
    createIngredientMutation,
    deleteIngredientMutation,
    detachProductIngredientMutation,
    getAllIngredientsQuery,
    getIngredientQuery,
    updateIngredientMutation,
} from './api';
import { Ingredient } from './types';

const keys = {
    root: () => ['ingredient'] as const,
    getAll: (organizationId: number) =>
        [...keys.root(), 'all', organizationId] as const,
    get: (organizationId: number, ingredientId: number) =>
        [...keys.root(), 'get', organizationId, ingredientId] as const,
    create: (organizationId: number) =>
        [...keys.root(), 'create', organizationId] as const,
    update: (organizationId: number, ingredientId: number) =>
        [...keys.root(), 'update', organizationId, ingredientId] as const,
    delete: (organizationId: number, ingredientId: number) =>
        [...keys.root(), 'delete', organizationId, ingredientId] as const,
    attach: (organizationId: number, productId: number, ingredientId: number) =>
        [
            ...keys.root(),
            'attach',
            organizationId,
            productId,
            ingredientId,
        ] as const,
    detach: (organizationId: number, productId: number, ingredientId: number) =>
        [
            ...keys.root(),
            'detach',
            organizationId,
            productId,
            ingredientId,
        ] as const,
};

export const ingredientService = {
    allQueryKey: (organizationId: number) => keys.getAll(organizationId),
    ingredientQueryKey: (organizationId: number, ingredientId: number) =>
        keys.get(organizationId, ingredientId),

    getCache: (organizationId: number, ingredientId: number = -1) => {
        if (ingredientId >= 0) {
            return queryClient.getQueryData<Ingredient>(
                ingredientService.ingredientQueryKey(
                    organizationId,
                    ingredientId,
                ),
            );
        }

        return queryClient.getQueryData<Collection<Ingredient>>(
            ingredientService.allQueryKey(organizationId),
        );
    },

    setCache: (
        data: Collection<Ingredient> | Ingredient | null,
        organizationId: number,
        ingredientId: number = -1,
    ) => {
        const queryKey =
            ingredientId >= 0
                ? ingredientService.ingredientQueryKey(
                      organizationId,
                      ingredientId,
                  )
                : ingredientService.allQueryKey(organizationId);

        return queryClient.setQueryData(queryKey, data);
    },

    removeCache: (organizationId: number, ingredientId: number = -1) => {
        const queryKey =
            ingredientId >= 0
                ? ingredientService.ingredientQueryKey(
                      organizationId,
                      ingredientId,
                  )
                : ingredientService.allQueryKey(organizationId);

        queryClient.removeQueries({ queryKey });
    },

    queryOptions: (organizationId: number, ingredientId: number = -1) => {
        const isAllQuery = ingredientId < 0;

        const queryKey = isAllQuery
            ? ingredientService.allQueryKey(organizationId)
            : ingredientService.ingredientQueryKey(
                  organizationId,
                  ingredientId,
              );

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                isAllQuery
                    ? getAllIngredientsQuery(organizationId, signal)
                    : getIngredientQuery(organizationId, ingredientId, signal),
            initialData: () =>
                ingredientService.getCache(organizationId, ingredientId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async (organizationId: number, ingredientId: number = -1) =>
        queryClient.prefetchQuery(
            ingredientService.queryOptions(organizationId, ingredientId),
        ),

    ensureQueryData: async (
        organizationId: number,
        ingredientId: number = -1,
    ) =>
        queryClient.ensureQueryData(
            ingredientService.queryOptions(organizationId, ingredientId),
        ),
};

export function useCreateIngredientMutation(organizationId: number) {
    return useMutation({
        mutationKey: keys.create(organizationId),
        mutationFn: createIngredientMutation,
        onSuccess: async (ingredient) => {
            ingredientService.setCache(ingredient, ingredient.id);
        },
    });
}

export function useUpdateIngredientMutation(
    organizationId: number,
    ingredientId: number,
) {
    return useMutation({
        mutationKey: keys.update(organizationId, ingredientId),
        mutationFn: updateIngredientMutation,
        onSuccess: async (ingredient) => {
            ingredientService.setCache(
                ingredient,
                organizationId,
                ingredientId,
            );
        },
    });
}

export function useDeleteIngredientMutation(
    organizationId: number,
    ingredientId: number,
) {
    return useMutation({
        mutationKey: keys.delete(organizationId, ingredientId),
        mutationFn: deleteIngredientMutation,
        onSettled: async () => {
            ingredientService.setCache(null, organizationId, ingredientId);
            await queryClient.invalidateQueries();
        },
    });
}

export function useAttachProductIngredientMutation(
    organizationId: number,
    productId: number,
    ingredientId: number,
) {
    return useMutation({
        mutationKey: keys.attach(organizationId, productId, ingredientId),
        mutationFn: attachProductIngredientMutation,
        onSettled: async () => {
            await queryClient.invalidateQueries();
        },
    });
}

export function useDetachProductIngredientMutation(
    organizationId: number,
    productId: number,
    ingredientId: number,
) {
    return useMutation({
        mutationKey: keys.detach(organizationId, productId, ingredientId),
        mutationFn: detachProductIngredientMutation,
        onSettled: async () => {
            await queryClient.invalidateQueries();
        },
    });
}
