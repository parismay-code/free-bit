import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import {
    attachRoleMutation,
    createRoleMutation,
    deleteRoleMutation,
    detachRoleMutation,
    getAllRolesQuery,
    getRoleQuery,
    updateRoleMutation,
} from './api';
import { Role } from './types';

const keys = {
    root: () => ['role'] as const,
    getAll: () => [...keys.root(), 'all'] as const,
    get: (roleId: number) => [...keys.root(), 'get', roleId] as const,
    create: () => [...keys.root(), 'create'] as const,
    update: (roleId: number) => [...keys.root(), 'update', roleId] as const,
    delete: (roleId: number) => [...keys.root(), 'delete', roleId] as const,
    attach: (userId: number, roleId: number) =>
        [...keys.root(), 'attach', userId, roleId] as const,
    detach: (userId: number, roleId: number) =>
        [...keys.root(), 'detach', userId, roleId] as const,
};

export const roleService = {
    allQueryKey: () => keys.getAll(),
    roleQueryKey: (roleId: number) => keys.get(roleId),

    getCache: (roleId: number = -1) => {
        if (roleId >= 0) {
            return queryClient.getQueryData<Role>(
                roleService.roleQueryKey(roleId),
            );
        }

        return queryClient.getQueryData<Array<Role>>(roleService.allQueryKey());
    },

    setCache: (data: Array<Role> | Role | null, roleId: number = -1) => {
        const queryKey =
            roleId >= 0
                ? roleService.roleQueryKey(roleId)
                : roleService.allQueryKey();

        return queryClient.setQueryData(queryKey, data);
    },

    removeCache: (roleId: number = -1) => {
        const queryKey =
            roleId >= 0
                ? roleService.roleQueryKey(roleId)
                : roleService.allQueryKey();

        queryClient.removeQueries({ queryKey });
    },

    queryOptions: (roleId: number = -1) => {
        const isAllQuery = roleId < 0;

        const queryKey = isAllQuery
            ? roleService.allQueryKey()
            : roleService.roleQueryKey(roleId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                isAllQuery
                    ? getAllRolesQuery(signal)
                    : getRoleQuery(roleId, signal),
            initialData: () => roleService.getCache(roleId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async (roleId: number = -1) =>
        queryClient.prefetchQuery(roleService.queryOptions(roleId)),

    ensureQueryData: async (roleId: number = -1) =>
        queryClient.ensureQueryData(roleService.queryOptions(roleId)),
};

export function useCreateRoleMutation() {
    return useMutation({
        mutationKey: keys.create(),
        mutationFn: createRoleMutation,
        onSuccess: async (role) => {
            roleService.setCache(role, role.id);
        },
    });
}

export function useUpdateRoleMutation(roleId: number) {
    return useMutation({
        mutationKey: keys.update(roleId),
        mutationFn: updateRoleMutation,
        onSuccess: async (role) => {
            roleService.setCache(role, roleId);
        },
    });
}

export function useDeleteRoleMutation(roleId: number) {
    return useMutation({
        mutationKey: keys.delete(roleId),
        mutationFn: deleteRoleMutation,
        onSettled: async () => {
            roleService.setCache(null, roleId);
            await queryClient.invalidateQueries();
        },
    });
}

export function useAttachRoleMutation(userId: number, roleId: number) {
    return useMutation({
        mutationKey: keys.attach(userId, roleId),
        mutationFn: attachRoleMutation,
    });
}

export function useDetachRoleMutation(userId: number, roleId: number) {
    return useMutation({
        mutationKey: keys.detach(userId, roleId),
        mutationFn: detachRoleMutation,
    });
}
