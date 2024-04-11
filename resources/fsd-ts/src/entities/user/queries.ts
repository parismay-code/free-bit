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
    getAll: () => [...keys.root(), 'all'] as const,
    get: (userId: number) => [...keys.root(), 'get', userId] as const,
    update: (userId: number) => [...keys.root(), 'update', userId] as const,
    delete: (userId: number) => [...keys.root(), 'delete', userId] as const,
};

export const userService = {
    allQueryKey: () => keys.getAll(),
    userQueryKey: (userId: number) => keys.get(userId),

    getCache: (userId: number = -1) => {
        if (userId >= 0) {
            return queryClient.getQueryData<User>(
                userService.userQueryKey(userId),
            );
        }

        return queryClient.getQueryData<Paginated<User>>(
            userService.allQueryKey(),
        );
    },

    setCache: (data: Paginated<User> | User | null, userId?: number) => {
        const queryKey = userId
            ? userService.userQueryKey(userId)
            : userService.allQueryKey();

        return queryClient.setQueryData(queryKey, data);
    },

    removeCache: (userId: number = -1) => {
        const queryKey =
            userId >= 0
                ? userService.userQueryKey(userId)
                : userService.allQueryKey();

        queryClient.removeQueries({ queryKey });
    },

    queryOptions: (arg: string | number) => {
        const isAllQuery = typeof arg === 'string';

        const queryKey = isAllQuery
            ? userService.allQueryKey()
            : userService.userQueryKey(arg);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                isAllQuery
                    ? getAllUsersQuery(arg, signal)
                    : getUserQuery(arg, signal),
            initialData: () => userService.getCache(isAllQuery ? -1 : arg)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async (arg: string | number) =>
        queryClient.prefetchQuery(userService.queryOptions(arg)),

    ensureQueryData: async (arg: string | number) =>
        queryClient.ensureQueryData(userService.queryOptions(arg)),
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
