import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Collection } from '~shared/types';
import {
    attachOrganizationRoleMutation,
    createOrganizationRoleMutation,
    deleteOrganizationRoleMutation,
    detachOrganizationRoleMutation,
    getAllOrganizationRolesQuery,
    getOrganizationRoleQuery,
    updateOrganizationRoleMutation,
} from './api';
import { OrganizationRole } from './types';

const keys = {
    root: () => ['organizationRole'] as const,
    getAll: (organizationId: number) =>
        [...keys.root(), 'all', organizationId] as const,
    get: (organizationId: number, organizationRoleId: number) =>
        [...keys.root(), 'get', organizationId, organizationRoleId] as const,
    create: (organizationId: number) =>
        [...keys.root(), 'create', organizationId] as const,
    update: (organizationId: number, organizationRoleId: number) =>
        [...keys.root(), 'update', organizationId, organizationRoleId] as const,
    delete: (organizationId: number, organizationRoleId: number) =>
        [...keys.root(), 'delete', organizationId, organizationRoleId] as const,
    attach: (
        organizationId: number,
        organizationRoleId: number,
        userId: number,
    ) =>
        [
            ...keys.root(),
            'attach',
            organizationId,
            organizationRoleId,
            userId,
        ] as const,
    detach: (
        organizationId: number,
        organizationRoleId: number,
        userId: number,
    ) =>
        [
            ...keys.root(),
            'detach',
            organizationId,
            organizationRoleId,
            userId,
        ] as const,
};

export const organizationRolesService = {
    queryKey(organizationId: number) {
        return keys.getAll(organizationId);
    },

    getCache(organizationId: number) {
        return queryClient.getQueryData<Collection<OrganizationRole>>(
            this.queryKey(organizationId),
        );
    },

    setCache(
        data: Collection<OrganizationRole> | null,
        organizationId: number,
    ) {
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
                getAllOrganizationRolesQuery(organizationId, signal),
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

export const organizationRoleService = {
    queryKey(organizationId: number, roleId: number) {
        return keys.get(organizationId, roleId);
    },

    getCache(organizationId: number, roleId: number) {
        return queryClient.getQueryData<OrganizationRole>(
            this.queryKey(organizationId, roleId),
        );
    },

    setCache(
        data: OrganizationRole | null,
        organizationId: number,
        roleId: number,
    ) {
        return queryClient.setQueryData(
            this.queryKey(organizationId, roleId),
            data,
        );
    },

    removeCache(organizationId: number, roleId: number) {
        return queryClient.removeQueries({
            queryKey: this.queryKey(organizationId, roleId),
        });
    },

    queryOptions(organizationId: number, roleId: number) {
        const queryKey = this.queryKey(organizationId, roleId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getOrganizationRoleQuery(organizationId, roleId, signal),
            initialData: () => this.getCache(organizationId, roleId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(organizationId: number, roleId: number) {
        return queryClient.prefetchQuery(
            this.queryOptions(organizationId, roleId),
        );
    },

    async ensureQueryData(organizationId: number, roleId: number) {
        return queryClient.ensureQueryData(
            this.queryOptions(organizationId, roleId),
        );
    },
};

export function useCreateOrganizationRoleMutation(organizationId: number) {
    return useMutation({
        mutationKey: keys.create(organizationId),
        mutationFn: createOrganizationRoleMutation,
        onSuccess: async (organizationRole) => {
            organizationRoleService.setCache(
                organizationRole,
                organizationId,
                organizationRole.id,
            );
        },
    });
}

export function useUpdateOrganizationRoleMutation(
    organizationId: number,
    organizationRoleId: number,
) {
    return useMutation({
        mutationKey: keys.update(organizationId, organizationRoleId),
        mutationFn: updateOrganizationRoleMutation,
        onSuccess: async (organizationRole) => {
            organizationRoleService.setCache(
                organizationRole,
                organizationId,
                organizationRoleId,
            );
        },
    });
}

export function useDeleteOrganizationRoleMutation(
    organizationId: number,
    organizationRoleId: number,
) {
    return useMutation({
        mutationKey: keys.delete(organizationId, organizationRoleId),
        mutationFn: deleteOrganizationRoleMutation,
        onSuccess: async () => {
            organizationRoleService.setCache(
                null,
                organizationId,
                organizationRoleId,
            );
            await queryClient.invalidateQueries();
        },
    });
}

export function useAttachOrganizationRoleMutation(
    organizationId: number,
    organizationRoleId: number,
    userId: number,
) {
    return useMutation({
        mutationKey: keys.attach(organizationId, organizationRoleId, userId),
        mutationFn: attachOrganizationRoleMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
}

export function useDetachOrganizationRoleMutation(
    organizationId: number,
    organizationRoleId: number,
    userId: number,
) {
    return useMutation({
        mutationKey: keys.detach(organizationId, organizationRoleId, userId),
        mutationFn: detachOrganizationRoleMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
}
