import { z } from 'zod';
import { baseUrl } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { OrganizationSchema } from './contracts';
import { mapOrganization, mapOrganizations } from './lib';
import { OrganizationDto } from './types';

export async function getAllOrganizationsQuery(signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl('/organizations'),
            method: 'GET',
        },
        response: {
            contract: zodContract(z.array(OrganizationSchema)),
            mapData: mapOrganizations,
        },
        abort: signal,
    });
}

export async function getOrganizationQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/organizations/${organizationId}`),
            method: 'GET',
        },
        response: {
            contract: zodContract(OrganizationSchema),
            mapData: mapOrganization,
        },
        abort: signal,
    });
}

export async function createOrganizationMutation(params: {
    organization: OrganizationDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl('/organizations'),
            method: 'POST',
            body: JSON.stringify(params.organization),
        },
        response: {
            contract: zodContract(OrganizationSchema),
            mapData: mapOrganization,
        },
    });
}

export async function updateOrganizationMutation(params: {
    organizationId: number;
    organization: OrganizationDto;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/organizations/${params.organizationId}`),
            method: 'PATCH',
            body: JSON.stringify(params.organization),
        },
        response: {
            contract: zodContract(OrganizationSchema),
            mapData: mapOrganization,
        },
    });
}

export async function deleteOrganizationMutation(params: {
    organizationId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(`/organizations/${params.organizationId}`),
            method: 'DELETE',
        },
    });
}
