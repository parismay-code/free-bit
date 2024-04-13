import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Paginated } from '~shared/types';
import {
    deleteUserMutation,
    getAllUsersQuery,
    getUserQuery,
    updateUserMutation,
} from './api';
import { User } from './types';

const keys = {
    root: () => ['user'] as const,
    getAll: (query: string) => [...keys.root(), 'all', query] as const,
    get: (userId: number) => [...keys.root(), 'get', userId] as const,
    update: (userId: number) => [...keys.root(), 'update', userId] as const,
    delete: (userId: number) => [...keys.root(), 'delete', userId] as const,
};

export const allUsersService = {
    queryKey(query: string) {
        return keys.getAll(query);
    },

    getCache(query: string) {
        return queryClient.getQueryData<Paginated<User>>(this.queryKey(query));
    },

    setCache(data: Paginated<User> | null, query: string) {
        return queryClient.setQueryData(this.queryKey(query), data);
    },

    removeCache(query: string) {
        return queryClient.removeQueries({ queryKey: this.queryKey(query) });
    },

    queryOptions(query: string) {
        const queryKey = this.queryKey(query);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) => getAllUsersQuery(query, signal),
            initialData: () => this.getCache(query)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(query: string) {
        return queryClient.prefetchQuery(this.queryOptions(query));
    },

    async ensureQueryData(query: string) {
        return queryClient.ensureQueryData(this.queryOptions(query));
    },
};

export const userService = {
    queryKey(userId: number) {
        return keys.get(userId);
    },

    getCache(userId: number) {
        return queryClient.getQueryData<User>(this.queryKey(userId));
    },

    setCache(data: User | null, userId: number) {
        return queryClient.setQueryData(this.queryKey(userId), data);
    },

    removeCache(userId: number) {
        return queryClient.removeQueries({ queryKey: this.queryKey(userId) });
    },

    queryOptions(userId: number) {
        const queryKey = this.queryKey(userId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) => getUserQuery(userId, signal),
            initialData: () => this.getCache(userId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(userId: number) {
        return queryClient.prefetchQuery(this.queryOptions(userId));
    },

    async ensureQueryData(userId: number) {
        return queryClient.ensureQueryData(this.queryOptions(userId));
    },
};

export function useUpdateUserMutation(userId: number) {
    return useMutation({
        mutationKey: keys.update(userId),
        mutationFn: updateUserMutation,
        onSuccess: async (user) => {
            userService.setCache(user, userId);
        },
    });
}

export function useDeleteUserMutation(userId: number) {
    return useMutation({
        mutationKey: keys.delete(userId),
        mutationFn: deleteUserMutation,
        onSuccess: async () => {
            userService.setCache(null, userId);
            await queryClient.invalidateQueries();
        },
    });
}
