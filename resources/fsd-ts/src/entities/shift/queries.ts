import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Collection } from '~shared/types';
import {
    createShiftMutation,
    deleteShiftMutation,
    getShiftQuery,
    getShiftsByOrganizationQuery,
    getShiftsByUserQuery,
    updateShiftMutation,
} from './api';
import { Shift } from './types';

const keys = {
    root: () => ['shift'] as const,
    getByOrganization: (organizationId: number) =>
        [...keys.root(), 'organization', organizationId] as const,
    getByUser: (userId: number) => [...keys.root(), 'user', userId] as const,
    get: (shiftId: number) => [...keys.root(), 'get', shiftId] as const,
    create: (userId: number) => [...keys.root(), 'create', userId] as const,
    update: (shiftId: number) => [...keys.root(), 'update', shiftId] as const,
    delete: (shiftId: number) => [...keys.root(), 'delete', shiftId] as const,
};

export const shiftService = {
    queryKey(shiftId: number) {
        return keys.get(shiftId);
    },

    getCache(shiftId: number) {
        return queryClient.getQueryData<Shift>(this.queryKey(shiftId));
    },

    setCache(data: Shift | null, shiftId: number) {
        return queryClient.setQueryData(this.queryKey(shiftId), data);
    },

    removeCache(shiftId: number) {
        return queryClient.removeQueries({
            queryKey: this.queryKey(shiftId),
        });
    },

    queryOptions(shiftId: number) {
        const queryKey = this.queryKey(shiftId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) => getShiftQuery(shiftId, signal),
            initialData: () => this.getCache(shiftId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(shiftId: number) {
        return queryClient.prefetchQuery(this.queryOptions(shiftId));
    },

    async ensureQueryData(shiftId: number) {
        return queryClient.ensureQueryData(this.queryOptions(shiftId));
    },
};

export const userShiftsService = {
    queryKey(userId: number) {
        return keys.getByUser(userId);
    },

    getCache(userId: number) {
        return queryClient.getQueryData<Collection<Shift>>(
            this.queryKey(userId),
        );
    },

    setCache(data: Collection<Shift> | null, userId: number) {
        return queryClient.setQueryData(this.queryKey(userId), data);
    },

    removeCache(userId: number) {
        return queryClient.removeQueries({
            queryKey: this.queryKey(userId),
        });
    },

    queryOptions(userId: number) {
        const queryKey = this.queryKey(userId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) => getShiftsByUserQuery(userId, signal),
            initialData: () => this.getCache(userId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(userId: number) {
        return queryClient.prefetchQuery(this.queryOptions(userId));
    },

    async ensureQueryData(userId: number) {
        return queryClient.ensureQueryData(this.queryOptions(userId));
    },
};

export const organizationShiftsService = {
    queryKey(organizationId: number) {
        return keys.getByOrganization(organizationId);
    },

    getCache(organizationId: number) {
        return queryClient.getQueryData<Collection<Shift>>(
            this.queryKey(organizationId),
        );
    },

    setCache(data: Collection<Shift> | null, organizationId: number) {
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
                getShiftsByOrganizationQuery(organizationId, signal),
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

export function useCreateShiftMutation(userId: number) {
    return useMutation({
        mutationKey: keys.create(userId),
        mutationFn: createShiftMutation,
        onSuccess: async (shift) => {
            shiftService.setCache(shift, shift.id);
        },
    });
}

export function useUpdateShiftMutation(shiftId: number) {
    return useMutation({
        mutationKey: keys.update(shiftId),
        mutationFn: updateShiftMutation,
        onSuccess: async (shift) => {
            shiftService.setCache(shift, shiftId);
        },
    });
}

export function useDeleteShiftMutation(shiftId: number) {
    return useMutation({
        mutationKey: keys.delete(shiftId),
        mutationFn: deleteShiftMutation,
        onSuccess: async () => {
            shiftService.setCache(null, shiftId);
            await queryClient.invalidateQueries();
        },
    });
}
