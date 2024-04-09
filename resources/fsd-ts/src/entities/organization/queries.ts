import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import {
    createOrganizationMutation,
    deleteOrganizationMutation,
    getAllOrganizationsQuery,
    getOrganizationQuery,
    updateOrganizationMutation,
} from './api';
import { Organization } from './types';

const keys = {
    root: () => ['organization'] as const,
    getAll: () => [...keys.root(), 'all'] as const,
    get: (organizationId: number) =>
        [...keys.root(), 'get', organizationId] as const,
    create: () => [...keys.root(), 'create'] as const,
    update: (organizationId: number) =>
        [...keys.root(), 'update', organizationId] as const,
    delete: (organizationId: number) =>
        [...keys.root(), 'delete', organizationId] as const,
};

export const organizationService = {
    allQueryKey: () => keys.getAll(),
    organizationQueryKey: (organizationId: number) => keys.get(organizationId),

    getCache: (organizationId: number = -1) => {
        if (organizationId >= 0) {
            return queryClient.getQueryData<Organization>(
                organizationService.organizationQueryKey(organizationId),
            );
        }

        return queryClient.getQueryData<Array<Organization>>(
            organizationService.allQueryKey(),
        );
    },

    setCache: (
        data: Array<Organization> | Organization | null,
        organizationId: number = -1,
    ) => {
        const queryKey =
            organizationId >= 0
                ? organizationService.organizationQueryKey(organizationId)
                : organizationService.allQueryKey();

        return queryClient.setQueryData(queryKey, data);
    },

    removeCache: (organizationId: number = -1) => {
        const queryKey =
            organizationId >= 0
                ? organizationService.organizationQueryKey(organizationId)
                : organizationService.allQueryKey();

        queryClient.removeQueries({ queryKey });
    },

    queryOptions: (organizationId: number = -1) => {
        const isAllQuery = organizationId < 0;

        const queryKey = isAllQuery
            ? organizationService.allQueryKey()
            : organizationService.organizationQueryKey(organizationId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                isAllQuery
                    ? getAllOrganizationsQuery(signal)
                    : getOrganizationQuery(organizationId, signal),
            initialData: () => organizationService.getCache(organizationId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async (organizationId: number = -1) =>
        queryClient.prefetchQuery(
            organizationService.queryOptions(organizationId),
        ),

    ensureQueryData: async (organizationId: number = -1) =>
        queryClient.ensureQueryData(
            organizationService.queryOptions(organizationId),
        ),
};

export function useCreateOrganizationMutation() {
    return useMutation({
        mutationKey: keys.create(),
        mutationFn: createOrganizationMutation,
        onSuccess: async (organization) => {
            organizationService.setCache(organization, organization.id);
        },
    });
}

export function useUpdateOrganizationMutation(organizationId: number) {
    return useMutation({
        mutationKey: keys.update(organizationId),
        mutationFn: updateOrganizationMutation,
        onSuccess: async (organization) => {
            organizationService.setCache(organization, organizationId);
        },
    });
}

export function useDeleteOrganizationMutation(organizationId: number) {
    return useMutation({
        mutationKey: keys.delete(organizationId),
        mutationFn: deleteOrganizationMutation,
        onSettled: async () => {
            organizationService.setCache(null, organizationId);
            await queryClient.invalidateQueries();
        },
    });
}
