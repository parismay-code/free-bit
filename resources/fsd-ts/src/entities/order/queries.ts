import {
    queryOptions as tsqQueryOptions,
    useMutation,
} from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query';
import { Collection, Paginated } from '~shared/types';
import {
    associateOrderCourierMutation,
    associateOrderEmployeeMutation,
    createOrderMutation,
    deleteOrderMutation,
    getAllOrdersQuery,
    getCurrentOrderByUserQuery,
    getLatestOrdersByOrganizationQuery,
    getLatestOrdersByUserQuery,
    getOrderQuery,
    getOrdersByOrganizationQuery,
    getOrdersByUserQuery,
    updateOrderMutation,
} from './api';
import { Order } from './types';

const keys = {
    root: () => ['order'] as const,
    getAll: (page: number, status: string) =>
        [...keys.root(), 'all', page, status] as const,
    getByUser: (userId: number, page: number, status: string) =>
        [...keys.root(), 'user', userId, page, status] as const,
    getLatestByUser: (userId: number) =>
        [...keys.root(), 'userLatest', userId] as const,
    getCurrentByUser: (userId: number) =>
        [...keys.root(), 'userCurrent', userId] as const,
    getByOrganization: (organizationId: number, page: number, status: string) =>
        [...keys.root(), 'organization', organizationId, page, status] as const,
    getLatestByOrganization: (organizationId: number) =>
        [...keys.root(), 'organizationLatest', organizationId] as const,
    get: (orderId: number) => [...keys.root(), 'get', orderId] as const,
    create: () => [...keys.root(), 'create'] as const,
    update: (orderId: number) => [...keys.root(), 'update', orderId] as const,
    delete: (orderId: number) => [...keys.root(), 'delete', orderId] as const,
    associateCourier: (orderId: number, userId: number) =>
        [...keys.root(), 'associateCourier', orderId, userId] as const,
    associateEmployee: (orderId: number, userId: number) =>
        [...keys.root(), 'associateEmployee', orderId, userId] as const,
};

export const allOrdersService = {
    queryKey(page: number, status: string) {
        return keys.getAll(page, status);
    },

    getCache(page: number, status: string) {
        return queryClient.getQueryData<Paginated<Order>>(
            this.queryKey(page, status),
        );
    },

    setCache(data: Paginated<Order> | null, page: number, status: string) {
        return queryClient.setQueryData(this.queryKey(page, status), data);
    },

    removeCache(page: number, status: string) {
        return queryClient.removeQueries({
            queryKey: this.queryKey(page, status),
        });
    },

    queryOptions(page: number, status: string) {
        const queryKey = this.queryKey(page, status);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getAllOrdersQuery(page, status, signal),
            initialData: () => this.getCache(page, status)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(page: number, status: string) {
        return queryClient.prefetchQuery(this.queryOptions(page, status));
    },

    async ensureQueryData(page: number, status: string) {
        return queryClient.ensureQueryData(this.queryOptions(page, status));
    },
};

export const orderService = {
    queryKey(orderId: number) {
        return keys.get(orderId);
    },

    getCache(orderId: number) {
        return queryClient.getQueryData<Order>(this.queryKey(orderId));
    },

    setCache(data: Order | null, orderId: number) {
        return queryClient.setQueryData(this.queryKey(orderId), data);
    },

    removeCache(orderId: number) {
        return queryClient.removeQueries({ queryKey: this.queryKey(orderId) });
    },

    queryOptions(orderId: number) {
        const queryKey = this.queryKey(orderId);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) => getOrderQuery(orderId, signal),
            initialData: () => this.getCache(orderId)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(orderId: number) {
        return queryClient.prefetchQuery(this.queryOptions(orderId));
    },

    async ensureQueryData(orderId: number) {
        return queryClient.ensureQueryData(this.queryOptions(orderId));
    },
};

export const userOrdersService = {
    queryKey(userId: number, page: number, status: string) {
        return keys.getByUser(userId, page, status);
    },

    getCache(userId: number, page: number, status: string) {
        return queryClient.getQueryData<Paginated<Order>>(
            this.queryKey(userId, page, status),
        );
    },

    setCache(
        data: Paginated<Order> | null,
        userId: number,
        page: number,
        status: string,
    ) {
        return queryClient.setQueryData(
            this.queryKey(userId, page, status),
            data,
        );
    },

    removeCache(userId: number, page: number, status: string) {
        return queryClient.removeQueries({
            queryKey: this.queryKey(userId, page, status),
        });
    },

    queryOptions(userId: number, page: number, status: string) {
        const queryKey = this.queryKey(userId, page, status);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getOrdersByUserQuery(userId, page, status, signal),
            initialData: () => this.getCache(userId, page, status)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(userId: number, page: number, status: string) {
        return queryClient.prefetchQuery(
            this.queryOptions(userId, page, status),
        );
    },

    async ensureQueryData(userId: number, page: number, status: string) {
        return queryClient.ensureQueryData(
            this.queryOptions(userId, page, status),
        );
    },
};

export const userLatestOrdersService = {
    queryKey(userId: number) {
        return keys.getLatestByUser(userId);
    },

    getCache(userId: number) {
        return queryClient.getQueryData<Collection<Order>>(
            this.queryKey(userId),
        );
    },

    setCache(data: Collection<Order> | null, userId: number) {
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
            queryFn: async ({ signal }) =>
                getLatestOrdersByUserQuery(userId, signal),
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

export const userCurrentOrderService = {
    queryKey(userId: number) {
        return keys.getCurrentByUser(userId);
    },

    getCache(userId: number) {
        return queryClient.getQueryData<Order>(this.queryKey(userId));
    },

    setCache(data: Order | null, userId: number) {
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
            queryFn: async ({ signal }) =>
                getCurrentOrderByUserQuery(userId, signal),
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

export const organizationOrdersService = {
    queryKey(organizationId: number, page: number, status: string) {
        return keys.getByOrganization(organizationId, page, status);
    },

    getCache(organizationId: number, page: number, status: string) {
        return queryClient.getQueryData<Paginated<Order>>(
            this.queryKey(organizationId, page, status),
        );
    },

    setCache(
        data: Paginated<Order> | null,
        organizationId: number,
        page: number,
        status: string,
    ) {
        return queryClient.setQueryData(
            this.queryKey(organizationId, page, status),
            data,
        );
    },

    removeCache(organizationId: number, page: number, status: string) {
        return queryClient.removeQueries({
            queryKey: this.queryKey(organizationId, page, status),
        });
    },

    queryOptions(organizationId: number, page: number, status: string) {
        const queryKey = this.queryKey(organizationId, page, status);

        return tsqQueryOptions({
            queryKey,
            queryFn: async ({ signal }) =>
                getOrdersByOrganizationQuery(
                    organizationId,
                    page,
                    status,
                    signal,
                ),
            initialData: () => this.getCache(organizationId, page, status)!,
            initialDataUpdatedAt: () =>
                queryClient.getQueryState(queryKey)?.dataUpdatedAt,
        });
    },

    async prefetchQuery(organizationId: number, page: number, status: string) {
        return queryClient.prefetchQuery(
            this.queryOptions(organizationId, page, status),
        );
    },

    async ensureQueryData(
        organizationId: number,
        page: number,
        status: string,
    ) {
        return queryClient.ensureQueryData(
            this.queryOptions(organizationId, page, status),
        );
    },
};

export const organizationLatestOrdersService = {
    queryKey(organizationId: number) {
        return keys.getLatestByOrganization(organizationId);
    },

    getCache(organizationId: number) {
        return queryClient.getQueryData<Collection<Order>>(
            this.queryKey(organizationId),
        );
    },

    setCache(data: Collection<Order> | null, organizationId: number) {
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
                getLatestOrdersByOrganizationQuery(organizationId, signal),
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

export function useCreateOrderMutation() {
    return useMutation({
        mutationKey: keys.create(),
        mutationFn: createOrderMutation,
        onSuccess: async (order) => {
            orderService.setCache(order, order.id);
        },
    });
}

export function useUpdateOrderMutation(orderId: number) {
    return useMutation({
        mutationKey: keys.update(orderId),
        mutationFn: updateOrderMutation,
        onSuccess: async (order) => {
            orderService.setCache(order, orderId);
        },
    });
}

export function useDeleteOrderMutation(orderId: number) {
    return useMutation({
        mutationKey: keys.delete(orderId),
        mutationFn: deleteOrderMutation,
        onSuccess: async () => {
            orderService.setCache(null, orderId);
            await queryClient.invalidateQueries();
        },
    });
}

export function useAssociateOrderCourierMutation(
    orderId: number,
    userId: number,
) {
    return useMutation({
        mutationKey: keys.associateCourier(orderId, userId),
        mutationFn: associateOrderCourierMutation,
    });
}

export function useAssociateOrderEmployeeMutation(
    orderId: number,
    userId: number,
) {
    return useMutation({
        mutationKey: keys.associateEmployee(orderId, userId),
        mutationFn: associateOrderEmployeeMutation,
    });
}
