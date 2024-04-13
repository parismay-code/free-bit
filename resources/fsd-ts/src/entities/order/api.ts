import { baseUrl } from '~shared/api';
import { CollectionSchema, PaginatedSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Collection } from '~shared/types';
import { OrderSchema } from './contracts';
import type { Order, OrderDto } from './types';

export async function getAllOrdersQuery(
    page: number,
    status: string,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl('/orders'),
            method: 'GET',
            query: {
                page,
                status,
            },
        },
        response: {
            contract: zodContract(PaginatedSchema(OrderSchema)),
            mapData: defaultMap<Collection<Order>>,
        },
        abort: signal,
    });
}

export async function getOrdersByOrganizationQuery(
    organizationId: number,
    page: number,
    status: string,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/orders/organization/${organizationId}`),
            method: 'GET',
            query: {
                page,
                status,
            },
        },
        response: {
            contract: zodContract(PaginatedSchema(OrderSchema)),
            mapData: defaultMap<Collection<Order>>,
        },
        abort: signal,
    });
}

export async function getLatestOrdersByOrganizationQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/orders/organization/${organizationId}/latest`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(OrderSchema)),
            mapData: defaultMap<Collection<Order>>,
        },
        abort: signal,
    });
}

export async function getOrdersByUserQuery(
    userId: number,
    page: number,
    status: string,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/orders/user/${userId}`),
            method: 'GET',
            query: {
                page,
                status,
            },
        },
        response: {
            contract: zodContract(PaginatedSchema(OrderSchema)),
            mapData: defaultMap<Collection<Order>>,
        },
        abort: signal,
    });
}

export async function getLatestOrdersByUserQuery(
    userId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/orders/user/${userId}/latest`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(OrderSchema)),
            mapData: defaultMap<Collection<Order>>,
        },
        abort: signal,
    });
}

export async function getCurrentOrderByUserQuery(
    userId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/orders/user/${userId}/current`),
            method: 'GET',
        },
        response: {
            contract: zodContract(OrderSchema),
            mapData: defaultMap<Order>,
        },
        abort: signal,
    });
}

export async function getOrderQuery(orderId: number, signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/orders/${orderId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(OrderSchema),
            mapData: defaultMap<Order>,
        },
        abort: signal,
    });
}

export async function createOrderMutation(params: {
    organizationId: number;
    order: OrderDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/orders/organization/${params.organizationId}`),
            method: 'POST',
            body: JSON.stringify(params.order),
        },
        response: {
            contract: zodContract(OrderSchema),
            mapData: defaultMap<Order>,
        },
    });
}

export async function updateOrderMutation(params: {
    organizationId: number;
    orderId: number;
    order: OrderDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/orders/${params.orderId}/organization/${params.organizationId}`,
            ),
            method: 'PATCH',
            body: JSON.stringify(params.order),
        },
        response: {
            contract: zodContract(OrderSchema),
            mapData: defaultMap<Order>,
        },
    });
}

export async function deleteOrderMutation(params: { orderId: number }) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/orders/${params.orderId}`),
            method: 'DELETE',
        },
    });
}

export async function associateOrderCourierMutation(params: {
    orderId: number;
    userId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/orders/${params.orderId}/courier/${params.userId}`),
            method: 'POST',
        },
    });
}

export async function associateOrderEmployeeMutation(params: {
    orderId: number;
    userId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/orders/${params.orderId}/employee/${params.userId}`),
            method: 'POST',
        },
    });
}
