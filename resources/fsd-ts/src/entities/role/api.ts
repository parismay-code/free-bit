import { z } from 'zod';
import { baseUrl } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { RoleSchema } from './contracts';
import { mapRole, mapRoles } from './lib';
import type { RoleDto } from './types';

export async function getAllRolesQuery(signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl('/roles'),
            method: 'GET',
        },
        response: {
            contract: zodContract(z.array(RoleSchema)),
            mapData: mapRoles,
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
            mapData: mapRole,
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
            mapData: mapRole,
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
            mapData: mapRole,
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
