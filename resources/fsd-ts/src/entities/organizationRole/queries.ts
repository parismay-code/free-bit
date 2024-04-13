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
        userId: number,
        organizationRoleId: number,
    ) =>
        [
            ...keys.root(),
            'attach',
            organizationId,
            userId,
            organizationRoleId,
        ] as const,
    detach: (
        organizationId: number,
        userId: number,
        organizationRoleId: number,
    ) =>
        [
            ...keys.root(),
            'detach',
            organizationId,
            userId,
            organizationRoleId,
        ] as const,
};

export const organizationRoleService = {
    allQueryKey: (organizationId: number) => keys.getAll(organizationId),
    organizationRoleQueryKey: (
        organizationId: number,
        organizationRoleId: number,
    ) => keys.get(organizationId, organizationRoleId),

    getCache: (organizationId: number, organizationRoleId: number = -1) => {
        if (organizationRoleId >= 0) {
            return queryClient.getQueryData<OrganizationRole>(
                organizationRoleService.organizationRoleQueryKey(
                    organizationId,
                    organizationRoleId,
                ),
            );
        }

        return queryClient.getQueryData<Collection<OrganizationRole>>(
            organizationRoleService.allQueryKey(organizationId),
        );
    },

    setCache: (
        data: Collection<OrganizationRole> | OrganizationRole | null,
        organizationId: number,
        organizationRoleId: number = -1,
    ) => {
        const queryKey =
            organizationRoleId >= 0
                ? organizationRoleService.organizationRoleQueryKey(
                      organizationId,
                      organizationRoleId,
                  )
                : organizationRoleService.allQueryKey(organizationId);

        return queryClient.setQueryData(queryKey, data);
    },

    removeCache: (organizationId: number, organizationRoleId: number = -1) => {
        const queryKey =
            organizationRoleId >= 0
                ? organizationRoleService.organizationRoleQueryKey(
                      organizationId,
                      organizationRoleId,
                  )
                : organizationRoleService.allQueryKey(organizationId);

        return queryClient.removeQueries({ queryKey });
    },

    queryOptions: (organizationId: number, organizationRoleId: number = -1) => {
        const isAllQuery = organizationRoleId < 0;

        const queryKey = isAllQuery
            ? organizationRoleService.allQueryKey(organizationId)
            : organizationRoleService.organizationRoleQueryKey(
                  organizationId,
                  organizationRoleId,
              );

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                isAllQuery
                    ? getAllOrganizationRolesQuery(organizationId, signal)
                    : getOrganizationRoleQuery(
                          organizationId,
                          organizationRoleId,
                          signal,
                      ),
            initialData: () =>
                organizationRoleService.getCache(
                    organizationId,
                    organizationRoleId,
                )!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async (
        organizationId: number,
        organizationRoleId: number = -1,
    ) =>
        queryClient.prefetchQuery(
            organizationRoleService.queryOptions(
                organizationId,
                organizationRoleId,
            ),
        ),

    ensureQueryData: async (
        organizationId: number,
        organizationRoleId: number = -1,
    ) =>
        queryClient.ensureQueryData(
            organizationRoleService.queryOptions(
                organizationId,
                organizationRoleId,
            ),
        ),
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
    userId: number,
    organizationRoleId: number,
) {
    return useMutation({
        mutationKey: keys.attach(organizationId, userId, organizationRoleId),
        mutationFn: attachOrganizationRoleMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
}

export function useDetachOrganizationRoleMutation(
    organizationId: number,
    userId: number,
    organizationRoleId: number,
) {
    return useMutation({
        mutationKey: keys.detach(organizationId, userId, organizationRoleId),
        mutationFn: detachOrganizationRoleMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
}
