import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import {
    associateOrderCourierMutation,
    associateOrderEmployeeMutation,
    createOrderMutation,
    deleteOrderMutation,
    getAllOrdersQuery,
    getOrderQuery,
    updateOrderMutation,
} from './api';
import { Order } from './types';

const keys = {
    root: () => ['order'] as const,
    getAll: (organizationId: number) =>
        [...keys.root(), 'all', organizationId] as const,
    get: (organizationId: number, orderId: number) =>
        [...keys.root(), 'get', organizationId, orderId] as const,
    create: (organizationId: number) =>
        [...keys.root(), 'create', organizationId] as const,
    update: (organizationId: number, orderId: number) =>
        [...keys.root(), 'update', organizationId, orderId] as const,
    delete: (organizationId: number, orderId: number) =>
        [...keys.root(), 'delete', organizationId, orderId] as const,
    associateCourier: (
        organizationId: number,
        orderId: number,
        userId: number,
    ) =>
        [
            ...keys.root(),
            'associateCourier',
            organizationId,
            orderId,
            userId,
        ] as const,
    associateEmployee: (
        organizationId: number,
        orderId: number,
        userId: number,
    ) =>
        [
            ...keys.root(),
            'associateEmployee',
            organizationId,
            orderId,
            userId,
        ] as const,
};

export const orderService = {
    allQueryKey: (organizationId: number) => keys.getAll(organizationId),
    orderQueryKey: (organizationId: number, orderId: number) =>
        keys.get(organizationId, orderId),

    getCache: (organizationId: number, orderId: number = -1) => {
        if (orderId >= 0) {
            return queryClient.getQueryData<Order>(
                orderService.orderQueryKey(organizationId, orderId),
            );
        }

        return queryClient.getQueryData<Array<Order>>(
            orderService.allQueryKey(organizationId),
        );
    },

    setCache: (
        data: Array<Order> | Order | null,
        organizationId: number,
        orderId: number = -1,
    ) => {
        const queryKey =
            orderId >= 0
                ? orderService.orderQueryKey(organizationId, orderId)
                : orderService.allQueryKey(organizationId);

        return queryClient.setQueryData(queryKey, data);
    },

    removeCache: (organizationId: number, orderId: number = -1) => {
        const queryKey =
            orderId >= 0
                ? orderService.orderQueryKey(organizationId, orderId)
                : orderService.allQueryKey(organizationId);

        queryClient.removeQueries({ queryKey });
    },

    queryOptions: (organizationId: number, orderId: number = -1) => {
        const isAllQuery = orderId < 0;

        const queryKey = isAllQuery
            ? orderService.allQueryKey(organizationId)
            : orderService.orderQueryKey(organizationId, orderId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                isAllQuery
                    ? getAllOrdersQuery(organizationId, signal)
                    : getOrderQuery(organizationId, orderId, signal),
            initialData: () => orderService.getCache(organizationId, orderId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    prefetchQuery: async (organizationId: number, orderId: number = -1) =>
        queryClient.prefetchQuery(
            orderService.queryOptions(organizationId, orderId),
        ),

    ensureQueryData: async (organizationId: number, orderId: number = -1) =>
        queryClient.ensureQueryData(
            orderService.queryOptions(organizationId, orderId),
        ),
};

export function useCreateOrderMutation(organizationId: number) {
    return useMutation({
        mutationKey: keys.create(organizationId),
        mutationFn: createOrderMutation,
        onSuccess: async (order) => {
            orderService.setCache(order, organizationId, order.id);
        },
    });
}

export function useUpdateOrderMutation(
    organizationId: number,
    orderId: number,
) {
    return useMutation({
        mutationKey: keys.update(organizationId, orderId),
        mutationFn: updateOrderMutation,
        onSuccess: async (order) => {
            orderService.setCache(order, organizationId, orderId);
        },
    });
}

export function useDeleteOrderMutation(
    organizationId: number,
    orderId: number,
) {
    return useMutation({
        mutationKey: keys.delete(organizationId, orderId),
        mutationFn: deleteOrderMutation,
        onSettled: async () => {
            orderService.setCache(null, organizationId, orderId);
            await queryClient.invalidateQueries();
        },
    });
}

export function useAssociateOrderCourierMutation(
    organizationId: number,
    orderId: number,
    userId: number,
) {
    return useMutation({
        mutationKey: keys.associateCourier(organizationId, orderId, userId),
        mutationFn: associateOrderCourierMutation,
    });
}

export function useAssociateOrderEmployeeMutation(
    organizationId: number,
    orderId: number,
    userId: number,
) {
    return useMutation({
        mutationKey: keys.associateEmployee(organizationId, orderId, userId),
        mutationFn: associateOrderEmployeeMutation,
    });
}
