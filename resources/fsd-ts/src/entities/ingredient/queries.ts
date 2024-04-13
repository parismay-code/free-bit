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
    getIngredientQuery,
    getIngredientsByOrganizationQuery,
    getIngredientsByProductQuery,
    updateIngredientMutation,
} from './api';
import { Ingredient } from './types';

const keys = {
    root: () => ['ingredient'] as const,
    getByOrganization: (organizationId: number) =>
        [...keys.root(), 'organization', organizationId] as const,
    getByProduct: (productId: number) =>
        [...keys.root(), 'product', productId] as const,
    get: (ingredientId: number) =>
        [...keys.root(), 'get', ingredientId] as const,
    create: (organizationId: number) =>
        [...keys.root(), 'create', organizationId] as const,
    update: (ingredientId: number) =>
        [...keys.root(), 'update', ingredientId] as const,
    delete: (ingredientId: number) =>
        [...keys.root(), 'delete', ingredientId] as const,
    attach: (ingredientId: number, productId: number) =>
        [...keys.root(), 'attach', ingredientId, productId] as const,
    detach: (ingredientId: number, productId: number) =>
        [...keys.root(), 'detach', ingredientId, productId] as const,
};

export const ingredientsByProductService = {
    queryKey(productId: number) {
        return keys.getByOrganization(productId);
    },

    getCache(productId: number) {
        return queryClient.getQueryData<Collection<Ingredient>>(
            this.queryKey(productId),
        );
    },

    setCache(data: Collection<Ingredient> | null, productId: number) {
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
            queryFn: async ({ signal }) =>
                getIngredientsByProductQuery(productId, signal),
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

export const ingredientsByOrganizationService = {
    queryKey(organizationId: number) {
        return keys.getByOrganization(organizationId);
    },

    getCache(organizationId: number) {
        return queryClient.getQueryData<Collection<Ingredient>>(
            this.queryKey(organizationId),
        );
    },

    setCache(data: Collection<Ingredient> | null, organizationId: number) {
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
                getIngredientsByOrganizationQuery(organizationId, signal),
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

export const ingredientService = {
    queryKey(ingredientId: number) {
        return keys.get(ingredientId);
    },

    getCache(ingredientId: number) {
        return queryClient.getQueryData<Ingredient>(
            this.queryKey(ingredientId),
        );
    },

    setCache(data: Ingredient | null, ingredientId: number) {
        return queryClient.setQueryData(this.queryKey(ingredientId), data);
    },

    removeCache(ingredientId: number) {
        return queryClient.removeQueries({
            queryKey: this.queryKey(ingredientId),
        });
    },

    queryOptions(ingredientId: number) {
        const queryKey = this.queryKey(ingredientId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getIngredientQuery(ingredientId, signal),
            initialData: () => this.getCache(ingredientId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(ingredientId: number) {
        return queryClient.prefetchQuery(this.queryOptions(ingredientId));
    },

    async ensureQueryData(ingredientId: number) {
        return queryClient.ensureQueryData(this.queryOptions(ingredientId));
    },
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

export function useUpdateIngredientMutation(ingredientId: number) {
    return useMutation({
        mutationKey: keys.update(ingredientId),
        mutationFn: updateIngredientMutation,
        onSuccess: async (ingredient) => {
            ingredientService.setCache(ingredient, ingredientId);
        },
    });
}

export function useDeleteIngredientMutation(ingredientId: number) {
    return useMutation({
        mutationKey: keys.delete(ingredientId),
        mutationFn: deleteIngredientMutation,
        onSuccess: async () => {
            ingredientService.setCache(null, ingredientId);
            await queryClient.invalidateQueries();
        },
    });
}

export function useAttachProductIngredientMutation(
    ingredientId: number,
    productId: number,
) {
    return useMutation({
        mutationKey: keys.attach(ingredientId, productId),
        mutationFn: attachProductIngredientMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
}

export function useDetachProductIngredientMutation(
    productId: number,
    ingredientId: number,
) {
    return useMutation({
        mutationKey: keys.detach(ingredientId, productId),
        mutationFn: detachProductIngredientMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
}
