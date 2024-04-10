import { baseUrl } from '~shared/api';
import { PaginatedSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Paginated } from '~shared/types';
import { UserSchema } from './contracts';
import { User, UserDto } from './types';

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
            contract: zodContract(PaginatedSchema(UserSchema)),
            mapData: defaultMap<Paginated<User>>,
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
            mapData: defaultMap<User>,
        },
        abort: signal,
    });
}

export async function updateUserMutation(params: {
    userId: number;
    user: UserDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/users/${params.userId}`),
            method: 'POST',
            body: JSON.stringify(params.user),
        },
        response: {
            contract: zodContract(UserSchema),
            mapData: defaultMap<User>,
        },
    });
}

export async function deleteUserMutation(params: { userId: number }) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/users/${params.userId}`),
            method: 'DELETE',
        },
    });
}
