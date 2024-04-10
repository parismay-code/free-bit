import { baseUrl } from '~shared/api';
import { CollectionSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Collection } from '~shared/types';
import { OrganizationSchema } from './contracts';
import { Organization, OrganizationDto } from './types';

export async function getAllOrganizationsQuery(signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl('/organizations'),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(OrganizationSchema)),
            mapData: defaultMap<Collection<Organization>>,
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
            mapData: defaultMap<Organization>,
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
            mapData: defaultMap<Organization>,
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
            mapData: defaultMap<Organization>,
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
