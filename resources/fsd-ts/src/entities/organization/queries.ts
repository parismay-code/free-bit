import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Paginated } from '~shared/types';
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
    getAll: (query: string) => [...keys.root(), 'all', query] as const,
    get: (organizationId: number) =>
        [...keys.root(), 'get', organizationId] as const,
    create: () => [...keys.root(), 'create'] as const,
    update: (organizationId: number) =>
        [...keys.root(), 'update', organizationId] as const,
    delete: (organizationId: number) =>
        [...keys.root(), 'delete', organizationId] as const,
};

export const organizationsService = {
    queryKey(query: string) {
        return keys.getAll(query);
    },

    getCache(query: string) {
        return queryClient.getQueryData<Paginated<Organization>>(
            this.queryKey(query),
        );
    },

    setCache(data: Paginated<Organization> | null, query: string) {
        return queryClient.setQueryData(this.queryKey(query), data);
    },

    removeCache(query: string) {
        queryClient.removeQueries({ queryKey: this.queryKey(query) });
    },

    queryOptions(query: string) {
        const queryKey = this.queryKey(query);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getAllOrganizationsQuery(query, signal),
            initialData: () => this.getCache(query)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(query: string) {
        return queryClient.prefetchQuery(this.queryOptions(query));
    },

    async ensureQueryData(query: string) {
        return queryClient.ensureQueryData(this.queryOptions(query));
    },
};

export const organizationService = {
    queryKey(organizationId: number) {
        return keys.get(organizationId);
    },

    getCache(organizationId: number) {
        return queryClient.getQueryData<Organization>(
            this.queryKey(organizationId),
        );
    },

    setCache(data: Organization | null, organizationId: number) {
        return queryClient.setQueryData(this.queryKey(organizationId), data);
    },

    removeCache(organizationId: number) {
        queryClient.removeQueries({ queryKey: this.queryKey(organizationId) });
    },

    queryOptions(organizationId: number) {
        const queryKey = this.queryKey(organizationId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getOrganizationQuery(organizationId, signal),
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
        onSuccess: async () => {
            organizationService.setCache(null, organizationId);
            await queryClient.invalidateQueries();
        },
    });
}
