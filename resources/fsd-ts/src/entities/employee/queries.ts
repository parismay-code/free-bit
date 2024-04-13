import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { userTypes } from '~entities/user';
import { queryClient } from '~shared/lib/react-query';
import { Paginated } from '~shared/types';
import {
    associateEmployeeMutation,
    dissociateEmployeeMutation,
    getAllEmployeesQuery,
} from './api';

const keys = {
    root: () => ['employee'] as const,
    getAll: (organizationId: number) =>
        [...keys.root(), 'all', organizationId] as const,
    associate: (organizationId: number, userId: number) =>
        [...keys.root(), 'update', organizationId, userId] as const,
    dissociate: (organizationId: number, userId: number) =>
        [...keys.root(), 'delete', organizationId, userId] as const,
};

export const employeeService = {
    queryKey(organizationId: number) {
        return keys.getAll(organizationId);
    },

    getCache(organizationId: number) {
        return queryClient.getQueryData<Paginated<userTypes.User>>(
            this.queryKey(organizationId),
        );
    },

    setCache(data: Paginated<userTypes.User> | null, organizationId: number) {
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
                getAllEmployeesQuery(organizationId, signal),
            initialData: () => this.getCache(organizationId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(organizationId: number) {
        return queryClient.prefetchQuery(
            employeeService.queryOptions(organizationId),
        );
    },

    async ensureQueryData(organizationId: number) {
        return queryClient.ensureQueryData(
            employeeService.queryOptions(organizationId),
        );
    },
};

export function useAssociateEmployeeMutation(
    organizationId: number,
    userId: number,
) {
    return useMutation({
        mutationKey: keys.associate(organizationId, userId),
        mutationFn: associateEmployeeMutation,
        onSuccess: async () => {
            employeeService.setCache(null, organizationId);
            await queryClient.invalidateQueries();
        },
    });
}

export function useDissociateEmployeeMutation(
    organizationId: number,
    userId: number,
) {
    return useMutation({
        mutationKey: keys.dissociate(organizationId, userId),
        mutationFn: dissociateEmployeeMutation,
        onSuccess: async () => {
            employeeService.setCache(null, organizationId);
            await queryClient.invalidateQueries();
        },
    });
}
