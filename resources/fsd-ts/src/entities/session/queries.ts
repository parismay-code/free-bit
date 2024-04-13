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
    logoutUserMutation,
    registerUserMutation,
} from './api';

const keys = {
    root: () => ['session'] as const,
    current: () => [...keys.root(), 'current'] as const,
    login: () => [...keys.root(), 'login'] as const,
    register: () => [...keys.root(), 'register'] as const,
    delete: () => [...keys.root(), 'delete'] as const,
};

export const sessionService = {
    queryKey() {
        return keys.current();
    },

    getCache() {
        return queryClient.getQueryData<userTypes.User>(this.queryKey());
    },

    setCache(user: userTypes.User | null) {
        return queryClient.setQueryData(this.queryKey(), user);
    },

    removeCache() {
        return queryClient.removeQueries({
            queryKey: this.queryKey(),
        });
    },

    queryOptions() {
        const queryKey = this.queryKey();
        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) => currentUserQuery(signal),
            initialData: () => this.getCache()!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery() {
        return queryClient.prefetchQuery(sessionService.queryOptions());
    },

    async ensureQueryData() {
        return queryClient.ensureQueryData(sessionService.queryOptions());
    },
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
        mutationFn: logoutUserMutation,
        onSuccess: async () => {
            sessionService.setCache(null);
            await queryClient.invalidateQueries();
            navigate(pathKeys.home());
        },
    });
}
