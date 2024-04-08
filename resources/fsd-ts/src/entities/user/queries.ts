import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
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

    getAllCache: () =>
        queryClient.getQueryData<Array<User>>(userService.allQueryKey()),
    getUserCache: (userId: number) =>
        queryClient.getQueryData<User>(userService.userQueryKey(userId)),

    setAllCache: (users: Array<User> | null) =>
        queryClient.setQueryData(userService.allQueryKey(), users),
    setUserCache: (userId: number, user: User | null) =>
        queryClient.setQueryData(userService.userQueryKey(userId), user),

    removeAllCache: () =>
        queryClient.removeQueries({ queryKey: userService.allQueryKey() }),
    removeUserCache: (userId: number) =>
        queryClient.removeQueries({
            queryKey: userService.userQueryKey(userId),
        }),

    allQueryOptions: (search: string) => {
        const usersKey = userService.allQueryKey();
        return tsqQueryOptions({
            queryKey: usersKey,
            queryFn: async ({ signal }) => getAllUsersQuery(search, signal),
            initialData: () => userService.getAllCache()!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(usersKey)?.dataUpdatedAt,
        });
    },
    userQueryOptions: (userId: number) => {
        const userKey = userService.userQueryKey(userId);
        return tsqQueryOptions({
            queryKey: userKey,
            queryFn: async ({ signal }) => getUserQuery(userId, signal),
            initialData: () => userService.getUserCache(userId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(userKey)?.dataUpdatedAt,
        });
    },

    prefetchAllQuery: async (search: string) => {
        await queryClient.prefetchQuery(userService.allQueryOptions(search));
    },
    prefetchUserQuery: async (userId: number) => {
        await queryClient.prefetchQuery(userService.userQueryOptions(userId));
    },

    ensureAllQueryData: async (search: string) =>
        queryClient.ensureQueryData(userService.allQueryOptions(search)),
    ensureUserQueryData: async (userId: number) =>
        queryClient.ensureQueryData(userService.userQueryOptions(userId)),
};

export function useUpdateUserMutation(userId: number) {
    return useMutation({
        mutationKey: keys.update(userId),
        mutationFn: updateUserMutation,
        onSuccess: async (user) => {
            userService.setUserCache(userId, user);
        },
    });
}

export function useDeleteUserMutation(userId: number) {
    return useMutation({
        mutationKey: keys.delete(userId),
        mutationFn: deleteUserMutation,
        onSettled: async () => {
            userService.setUserCache(userId, null);
            await queryClient.invalidateQueries();
        },
    });
}
