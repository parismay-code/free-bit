import { baseUrl } from '~shared/api';
import { CollectionSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Collection } from '~shared/types';
import { OrganizationRoleSchema } from './contracts';
import { OrganizationRole, OrganizationRoleDto } from './types';

export async function getAllOrganizationRolesQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/organizations/${organizationId}/roles`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(OrganizationRoleSchema)),
            mapData: defaultMap<Collection<OrganizationRole>>,
        },
        abort: signal,
    });
}

export async function getOrganizationRoleQuery(
    organizationId: number,
    organizationRoleId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(
                `/organizations/${organizationId}/roles/${organizationRoleId}`,
            ),
            method: 'GET',
        },
        response: {
            contract: zodContract(OrganizationRoleSchema),
            mapData: defaultMap<OrganizationRole>,
        },
        abort: signal,
    });
}

export async function createOrganizationRoleMutation(params: {
    organizationId: number;
    organizationRole: OrganizationRoleDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/organizations/${params.organizationId}/roles`),
            method: 'POST',
            body: JSON.stringify(params.organizationRole),
        },
        response: {
            contract: zodContract(OrganizationRoleSchema),
            mapData: defaultMap<OrganizationRole>,
        },
    });
}

export async function updateOrganizationRoleMutation(params: {
    organizationId: number;
    organizationRoleId: number;
    organizationRole: OrganizationRoleDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/roles/${params.organizationRoleId}`,
            ),
            method: 'PATCH',
            body: JSON.stringify(params.organizationRole),
        },
        response: {
            contract: zodContract(OrganizationRoleSchema),
            mapData: defaultMap<OrganizationRole>,
        },
    });
}

export async function deleteOrganizationRoleMutation(params: {
    organizationId: number;
    organizationRoleId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/roles/${params.organizationRoleId}`,
            ),
            method: 'DELETE',
        },
    });
}

export async function attachOrganizationRoleMutation(params: {
    organizationId: number;
    organizationRoleId: number;
    userId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `organizations/${params.organizationId}/roles/${params.organizationRoleId}/user/${params.userId}/attach`,
            ),
            method: 'POST',
        },
    });
}

export async function detachOrganizationRoleMutation(params: {
    organizationId: number;
    organizationRoleId: number;
    userId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `organizations/${params.organizationId}/roles/${params.organizationRoleId}/user/${params.userId}/detach`,
            ),
            method: 'POST',
        },
    });
}
