import { z } from 'zod';
import { baseUrl } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { UserSchema } from './contracts';
import { mapUser, mapUsers } from './lib';
import type { UpdateUserDto } from './types';

export async function getAllUsersQuery(search: string, signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl('/users'),
            method: 'GET',
            query: {
                query: search,
            },
        },
        response: {
            contract: zodContract(z.array(UserSchema)),
            mapData: mapUsers,
        },
        abort: signal,
    });
}

export async function getUserQuery(userId: number, signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/users/${userId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(UserSchema),
            mapData: mapUser,
        },
        abort: signal,
    });
}

export async function updateUserMutation(params: {
    userId: number;
    user: UpdateUserDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/users/${params.userId}`),
            method: 'POST',
            body: JSON.stringify(params.user),
        },
        response: {
            contract: zodContract(UserSchema),
            mapData: mapUser,
        },
    });
}

export async function deleteUserMutation(params: { userId: number }) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/users/${params.userId}`),
            method: 'POST',
        },
    });
}
