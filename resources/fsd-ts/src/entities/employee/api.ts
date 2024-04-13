import { userContracts, userTypes } from '~entities/user';
import { baseUrl } from '~shared/api';
import { PaginatedSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Paginated } from '~shared/types';

export async function getAllEmployeesQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/organizations/${organizationId}/users`),
            method: 'GET',
        },
        response: {
            contract: zodContract(PaginatedSchema(userContracts.UserSchema)),
            mapData: defaultMap<Paginated<userTypes.User>>,
        },
        abort: signal,
    });
}

export async function associateEmployeeMutation(params: {
    organizationId: number;
    userId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/user/${params.userId}/associate`,
            ),
            method: 'POST',
        },
    });
}

export async function dissociateEmployeeMutation(params: {
    organizationId: number;
    userId: number;
}) {
    return createJsonMutation({
        request: {
            url: baseUrl(
                `/organizations/${params.organizationId}/user/${params.userId}/dissociate`,
            ),
            method: 'POST',
        },
    });
}
