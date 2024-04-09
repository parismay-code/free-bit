import { z } from 'zod';
import { baseUrl } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { OrderSchema } from './contracts';
import { mapOrder, mapOrders } from './lib';
import type { OrderDto } from './types';

export async function getAllOrdersQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/organizations/${organizationId}/orders`),
            method: 'GET',
        },
        response: {
            contract: zodContract(z.array(OrderSchema)),
            mapData: mapOrders,
        },
        abort: signal,
    });
}

export async function getOrderQuery(
    organizationId: number,
    orderId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/organizations/${organizationId}/orders/${orderId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(OrderSchema),
            mapData: mapOrder,
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
            url: baseUrl(`/organizations/${params.organizationId}/orders`),
            method: 'POST',
            body: JSON.stringify(params.order),
        },
        response: {
            contract: zodContract(OrderSchema),
            mapData: mapOrder,
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
                `/organizations/${params.organizationId}/orders/${params.orderId}`,
            ),
            method: 'POST',
            body: JSON.stringify(params.order),
        },
        response: {
            contract: zodContract(OrderSchema),
            mapData: mapOrder,
        },
    });
}

export async function deleteOrderMutation(params: {
    organizationId: number;
    orderId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/orders/${params.orderId}`,
            ),
            method: 'DELETE',
        },
    });
}

export async function associateOrderCourierMutation(params: {
    organizationId: number;
    orderId: number;
    userId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `organizations/${params.organizationId}/orders/${params.orderId}/courier/${params.userId}`,
            ),
            method: 'POST',
        },
    });
}

export async function associateOrderEmployeeMutation(params: {
    organizationId: number;
    orderId: number;
    userId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `organizations/${params.organizationId}/orders/${params.orderId}/employee/${params.userId}`,
            ),
            method: 'POST',
        },
    });
}
