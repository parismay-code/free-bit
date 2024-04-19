import { baseUrl } from '~shared/api';
import { PaginatedSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
    prepareFormData,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Paginated } from '~shared/types';
import { OrganizationSchema } from './contracts';
import { Organization, OrganizationDto } from './types';

export async function getAllOrganizationsQuery(
    query: string,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl('/organizations'),
            method: 'GET',
            query: {
                query,
            },
        },
        response: {
            contract: zodContract(PaginatedSchema(OrganizationSchema)),
            mapData: defaultMap<Paginated<Organization>>,
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
            body: prepareFormData(params.organization),
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
            body: prepareFormData(params.organization),
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
