import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { userTypes } from '~entities/user';
import { queryClient } from '~shared/lib/react-query';
import { pathKeys } from '~shared/lib/react-router';
import {
    currentUserQuery,
    loginUserMutation,
    registerUserMutation,
} from './api';
import { hasToken } from './lib';

const keys = {
    root: () => ['session'] as const,
    current: () => [...keys.root(), 'current'] as const,
    login: () => [...keys.root(), 'login'] as const,
    register: () => [...keys.root(), 'register'] as const,
    delete: () => [...keys.root(), 'delete'] as const,
};

export const sessionService = {
    queryKey: () => keys.current(),

    getCache: () =>
        queryClient.getQueryData<userTypes.User>(sessionService.queryKey()),

    setCache: (user: userTypes.User | null) =>
        queryClient.setQueryData(sessionService.queryKey(), user),

    removeCache: () =>
        queryClient.removeQueries({ queryKey: sessionService.queryKey() }),

    queryOptions: () => {
        const userKey = sessionService.queryKey();
        return tsqQueryOptions({
            queryKey: userKey,
            queryFn: async ({ signal }) =>
                hasToken() ? currentUserQuery(signal) : null,
            initialData: () => sessionService.getCache()!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(userKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async () => {
        await queryClient.prefetchQuery(sessionService.queryOptions());
    },

    ensureQueryData: async () =>
        queryClient.ensureQueryData(sessionService.queryOptions()),
};

export function useLoginUserMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: keys.login(),
        mutationFn: loginUserMutation,
        onSuccess: async (user) => {
            sessionService.setCache(user);
            navigate(pathKeys.home());
        },
    });
}

export function useRegisterUserMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: keys.register(),
        mutationFn: registerUserMutation,
        onSuccess: async (user) => {
            sessionService.setCache(user);
            navigate(pathKeys.home());
        },
    });
}

export function useLogoutMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: keys.delete(),
        onSettled: async () => {
            sessionService.setCache(null);
            await queryClient.invalidateQueries();
            navigate(pathKeys.home());
        },
    });
}
