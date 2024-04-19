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

export async function getShiftsByOrganizationQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/shifts/organization/${organizationId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(ShiftSchema)),
            mapData: defaultMap<Collection<Shift>>,
        },
        abort: signal,
    });
}

export async function getShiftsByUserQuery(
    userId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/shifts/user/${userId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(ShiftSchema)),
            mapData: defaultMap<Collection<Shift>>,
        },
        abort: signal,
    });
}

export async function getShiftQuery(shiftId: number, signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/shifts/${shiftId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(ShiftSchema),
            mapData: defaultMap<Shift>,
        },
        abort: signal,
    });
}

export async function createShiftMutation(params: {
    userId: number;
    shift: ShiftDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/shifts/user/${params.userId}`),
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
    shiftId: number;
    shift: ShiftDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/shifts/${params.shiftId}`),
            method: 'PATCH',
            body: JSON.stringify(params.shift),
        },
        response: {
            contract: zodContract(ShiftSchema),
            mapData: defaultMap<Shift>,
        },
    });
}

export async function deleteShiftMutation(params: { shiftId: number }) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/shifts/${params.shiftId}`),
            method: 'DELETE',
        },
    });
}
