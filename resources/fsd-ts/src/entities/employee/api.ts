import { userContracts, userTypes } from '~entities/user';
import { baseUrl } from '~shared/api';
import { CollectionSchema } from '~shared/contracts';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { Collection } from '~shared/types';

export async function getAllEmployeesQuery(
    organizationId: number,
    signal?: AbortSignal,
) {
    return createJsonQuery({
        request: {
            url: baseUrl(`/organizations/${organizationId}/employees`),
            method: 'GET',
        },
        response: {
            contract: zodContract(CollectionSchema(userContracts.UserSchema)),
            mapData: defaultMap<Collection<userTypes.User>>,
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
                `/organizations/${params.organizationId}/employees/${params.userId}/associate`,
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
                `/organizations/${params.organizationId}/employees/${params.userId}/dissociate`,
            ),
            method: 'POST',
        },
    });
}
