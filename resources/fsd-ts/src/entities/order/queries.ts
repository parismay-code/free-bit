import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '~shared/lib/react-query';
import { pathKeys } from '~shared/lib/react-router';
import { currentUserQuery, loginUserMutation } from './api';
import { hasToken, sessionStore } from './model';
import { User } from './types';

const keys = {
    root: () => ['session'] as const,
    currentUser: () => [...keys.root(), 'currentUser'] as const,
    loginUser: () => [...keys.root(), 'loginUser'] as const,
    deleteUser: () => [...keys.root(), 'deleteUser'] as const,
};

export const userService = {
    queryKey: () => keys.currentUser(),

    getCache: () => queryClient.getQueryData<User>(userService.queryKey()),

    setCache: (user: User | null) =>
        queryClient.setQueryData(userService.queryKey(), user),

    removeCache: () =>
        queryClient.removeQueries({ queryKey: userService.queryKey() }),

    queryOptions: () => {
        const userKey = userService.queryKey();
        return tsqQueryOptions({
            queryKey: userKey,
            queryFn: async ({ signal }) =>
                hasToken() ? currentUserQuery(signal) : null,
            initialData: () => userService.getCache()!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(userKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async () => {
        await queryClient.prefetchQuery(userService.queryOptions());
    },

    ensureQueryData: async () =>
        queryClient.ensureQueryData(userService.queryOptions()),
};

export function useLoginUserMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: keys.loginUser(),
        mutationFn: loginUserMutation,
        onSuccess: async (user) => {
            sessionStore.setState({ token: user.token });
            userService.setCache(user);
            navigate(pathKeys.home());
        },
    });
}

export function useLogoutMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: keys.deleteUser(),
        onSettled: async () => {
            sessionStore.getState().updateToken(null);
            userService.setCache(null);
            await queryClient.invalidateQueries();
            navigate(pathKeys.home());
        },
    });
}
