import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Collection } from '~shared/types';
import {
    createShiftMutation,
    deleteShiftMutation,
    getUserShiftsQuery,
    updateShiftMutation,
} from './api';
import { Shift } from './types';

const keys = {
    root: () => ['shift'] as const,
    getAll: (organizationId: number) =>
        [...keys.root(), 'all', organizationId] as const,
    get: (organizationId: number, userId: number, shiftId: number) =>
        [...keys.root(), 'get', organizationId, userId, shiftId] as const,
    create: (organizationId: number, userId: number) =>
        [...keys.root(), 'create', organizationId, userId] as const,
    update: (organizationId: number, userId: number, shiftId: number) =>
        [...keys.root(), 'update', organizationId, userId, shiftId] as const,
    delete: (organizationId: number, userId: number, shiftId: number) =>
        [...keys.root(), 'delete', organizationId, userId, shiftId] as const,
};

export const shiftService = {
    allQueryKey: (organizationId: number) => keys.getAll(organizationId),
    shiftQueryKey: (organizationId: number, userId: number, shiftId: number) =>
        keys.get(organizationId, userId, shiftId),

    getCache: (
        organizationId: number,
        userId: number = -1,
        shiftId: number = -1,
    ) => {
        if (userId >= 0 && shiftId >= 0) {
            return queryClient.getQueryData<Shift>(
                shiftService.shiftQueryKey(organizationId, userId, shiftId),
            );
        }

        return queryClient.getQueryData<Collection<Shift>>(
            shiftService.allQueryKey(organizationId),
        );
    },

    setCache: (
        data: Collection<Shift> | Shift | null,
        organizationId: number,
        userId: number = -1,
        shiftId: number = -1,
    ) => {
        const queryKey =
            userId >= 0 && shiftId >= 0
                ? shiftService.shiftQueryKey(organizationId, userId, shiftId)
                : shiftService.allQueryKey(organizationId);

        return queryClient.setQueryData(queryKey, data);
    },

    removeCache: (
        organizationId: number,
        userId: number = -1,
        shiftId: number = -1,
    ) => {
        const queryKey =
            userId >= 0 && shiftId >= 0
                ? shiftService.shiftQueryKey(organizationId, userId, shiftId)
                : shiftService.allQueryKey(organizationId);

        return queryClient.removeQueries({ queryKey });
    },

    queryOptions: (
        organizationId: number,
        userId: number = -1,
        shiftId: number = -1,
    ) => {
        const isAllQuery = userId < 0 || shiftId < 0;

        const queryKey = isAllQuery
            ? shiftService.allQueryKey(organizationId)
            : shiftService.shiftQueryKey(organizationId, userId, shiftId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getUserShiftsQuery(organizationId, userId, signal),
            initialData: () =>
                shiftService.getCache(organizationId, userId, shiftId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async (
        organizationId: number,
        userId: number = -1,
        shiftId: number = -1,
    ) =>
        queryClient.prefetchQuery(
            shiftService.queryOptions(organizationId, userId, shiftId),
        ),

    ensureQueryData: async (
        organizationId: number,
        userId: number = -1,
        shiftId: number = -1,
    ) =>
        queryClient.ensureQueryData(
            shiftService.queryOptions(organizationId, userId, shiftId),
        ),
};

export function useCreateShiftMutation(organizationId: number, userId: number) {
    return useMutation({
        mutationKey: keys.create(organizationId, userId),
        mutationFn: createShiftMutation,
        onSuccess: async (shift) => {
            shiftService.setCache(shift, organizationId, userId, shift.id);
        },
    });
}

export function useUpdateShiftMutation(
    organizationId: number,
    userId: number,
    shiftId: number,
) {
    return useMutation({
        mutationKey: keys.update(organizationId, userId, shiftId),
        mutationFn: updateShiftMutation,
        onSuccess: async (shift) => {
            shiftService.setCache(shift, organizationId, userId, shiftId);
        },
    });
}

export function useDeleteShiftMutation(
    organizationId: number,
    userId: number,
    shiftId: number,
) {
    return useMutation({
        mutationKey: keys.delete(organizationId, userId, shiftId),
        mutationFn: deleteShiftMutation,
        onSuccess: async () => {
            shiftService.setCache(null, organizationId, userId, shiftId);
            await queryClient.invalidateQueries();
        },
    });
}
