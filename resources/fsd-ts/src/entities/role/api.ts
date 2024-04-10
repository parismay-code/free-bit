import { baseUrl } from '~shared/api';
import { CollectionSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Collection } from '~shared/types';
import { RoleSchema } from './contracts';
import { Role, RoleDto } from './types';

export async function getAllRolesQuery(signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl('/roles'),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(RoleSchema)),
            mapData: defaultMap<Collection<Role>>,
        },
        abort: signal,
    });
}

export async function getRoleQuery(roleId: number, signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/roles/${roleId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(RoleSchema),
            mapData: defaultMap<Role>,
        },
        abort: signal,
    });
}

export async function createRoleMutation(params: { role: RoleDto }) {
    return createJsonMutation({
        request: {
            url: baseUrl('/roles'),
            method: 'POST',
            body: JSON.stringify(params.role),
        },
        response: {
            contract: zodContract(RoleSchema),
            mapData: defaultMap<Role>,
        },
    });
}

export async function updateRoleMutation(params: {
    roleId: number;
    role: RoleDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/roles/${params.roleId}`),
            method: 'PATCH',
            body: JSON.stringify(params.role),
        },
        response: {
            contract: zodContract(RoleSchema),
            mapData: defaultMap<Role>,
        },
    });
}

export async function deleteRoleMutation(params: { roleId: number }) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/roles/${params.roleId}`),
            method: 'DELETE',
        },
    });
}

export async function attachRoleMutation(params: {
    userId: number;
    roleId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/users/${params.userId}/roles/${params.roleId}/attach`,
            ),
            method: 'POST',
        },
    });
}

export async function detachRoleMutation(params: {
    userId: number;
    roleId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/users/${params.userId}/roles/${params.roleId}/detach`,
            ),
            method: 'POST',
        },
    });
}
