import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Collection } from '~shared/types';
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
    attach: (roleId: number, userId: number) =>
        [...keys.root(), 'attach', roleId, userId] as const,
    detach: (roleId: number, userId: number) =>
        [...keys.root(), 'detach', roleId, userId] as const,
};

export const allRolesService = {
    queryKey() {
        return keys.getAll();
    },

    getCache() {
        return queryClient.getQueryData<Collection<Role>>(this.queryKey());
    },

    setCache(data: Collection<Role> | null) {
        return queryClient.setQueryData(this.queryKey(), data);
    },

    removeCache() {
        return queryClient.removeQueries({ queryKey: this.queryKey() });
    },

    queryOptions() {
        const queryKey = this.queryKey();

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) => getAllRolesQuery(signal),
            initialData: () => this.getCache()!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery() {
        return queryClient.prefetchQuery(this.queryOptions());
    },

    async ensureQueryData() {
        return queryClient.ensureQueryData(this.queryOptions());
    },
};

export const roleService = {
    queryKey(roleId: number) {
        return keys.get(roleId);
    },

    getCache(roleId: number) {
        return queryClient.getQueryData<Role>(this.queryKey(roleId));
    },

    setCache(data: Role | null, roleId: number) {
        return queryClient.setQueryData(this.queryKey(roleId), data);
    },

    removeCache(roleId: number) {
        return queryClient.removeQueries({ queryKey: this.queryKey(roleId) });
    },

    queryOptions(roleId: number) {
        const queryKey = this.queryKey(roleId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) => getRoleQuery(roleId, signal),
            initialData: () => this.getCache(roleId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(roleId: number) {
        return queryClient.prefetchQuery(this.queryOptions(roleId));
    },

    async ensureQueryData(roleId: number) {
        return queryClient.ensureQueryData(this.queryOptions(roleId));
    },
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
        onSuccess: async () => {
            roleService.setCache(null, roleId);
            await queryClient.invalidateQueries();
        },
    });
}

export function useAttachRoleMutation(roleId: number, userId: number) {
    return useMutation({
        mutationKey: keys.attach(roleId, userId),
        mutationFn: attachRoleMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
}

export function useDetachRoleMutation(roleId: number, userId: number) {
    return useMutation({
        mutationKey: keys.detach(roleId, userId),
        mutationFn: detachRoleMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
}
