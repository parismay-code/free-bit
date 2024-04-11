import { baseUrl } from '~shared/api';
import { CollectionSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Collection } from '~shared/types';
import { ShiftSchema } from './contracts';
import { Shift, ShiftDto } from './types';

export async function getAllShiftsQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/organizations/${organizationId}/shifts`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(ShiftSchema)),
            mapData: defaultMap<Collection<Shift>>,
        },
        abort: signal,
    });
}

export async function getUserShiftsQuery(
    organizationId: number,
    userId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(
                `/organizations/${organizationId}/employee/${userId}/shifts`,
            ),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(ShiftSchema)),
            mapData: defaultMap<Collection<Shift>>,
        },
        abort: signal,
    });
}

export async function createShiftMutation(params: {
    organizationId: number;
    userId: number;
    shift: ShiftDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/employee/${params.userId}/shifts`,
            ),
            method: 'POST',
            body: JSON.stringify(params.shift),
        },
        response: {
            contract: zodContract(ShiftSchema),
            mapData: defaultMap<Shift>,
        },
    });
}

export async function updateShiftMutation(params: {
    organizationId: number;
    userId: number;
    shiftId: number;
    shift: ShiftDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/employee/${params.userId}/shifts/${params.shiftId}`,
            ),
            method: 'PATCH',
            body: JSON.stringify(params.shift),
        },
        response: {
            contract: zodContract(ShiftSchema),
            mapData: defaultMap<Shift>,
        },
    });
}

export async function deleteShiftMutation(params: {
    organizationId: number;
    userId: number;
    shiftId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/employee/${params.userId}/shifts/${params.shiftId}`,
            ),
            method: 'DELETE',
        },
    });
}
