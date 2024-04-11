import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { userTypes } from '~entities/user';
import { queryClient } from '~shared/lib/react-query';
import { Collection } from '~shared/types';
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
    queryKey: (organizationId: number) => keys.getAll(organizationId),

    getCache: (organizationId: number) =>
        queryClient.getQueryData<Collection<userTypes.User>>(
            employeeService.queryKey(organizationId),
        ),

    setCache: (
        data: Collection<userTypes.User> | null,
        organizationId: number,
    ) =>
        queryClient.setQueryData(
            employeeService.queryKey(organizationId),
            data,
        ),

    removeCache: (organizationId: number) =>
        queryClient.removeQueries({
            queryKey: employeeService.queryKey(organizationId),
        }),

    queryOptions: (organizationId: number) => {
        const queryKey = employeeService.queryKey(organizationId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getAllEmployeesQuery(organizationId, signal),
            initialData: () => employeeService.getCache(organizationId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async (organizationId: number) =>
        queryClient.prefetchQuery(employeeService.queryOptions(organizationId)),

    ensureQueryData: async (organizationId: number) =>
        queryClient.ensureQueryData(
            employeeService.queryOptions(organizationId),
        ),
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
