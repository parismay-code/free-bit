import { userContracts, userTypes } from '~entities/user';
import { baseUrl } from '~shared/api';
import {
    createJsonMutation,
    createJsonQuery,
    defaultMap,
} from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { LoginUserDto, type RegisterUserDto } from './types';

export async function currentUserQuery(signal?: AbortSignal) {
    return createJsonQuery({
        request: {
            url: baseUrl('/user'),
            method: 'GET',
        },
        response: {
            contract: zodContract(userContracts.UserSchema.nullable()),
            mapData: defaultMap<userTypes.User | null>,
        },
        abort: signal,
    });
}

export async function loginUserMutation(params: { user: LoginUserDto }) {
    return createJsonMutation({
        request: {
            url: baseUrl('/login'),
            method: 'POST',
            body: JSON.stringify(params.user),
        },
        response: {
            contract: zodContract(userContracts.UserSchema),
            mapData: defaultMap<userTypes.User>,
        },
    });
}

export async function registerUserMutation(params: { user: RegisterUserDto }) {
    return createJsonMutation({
        request: {
            url: baseUrl('/register'),
            method: 'POST',
            body: JSON.stringify(params.user),
        },
        response: {
            contract: zodContract(userContracts.UserSchema),
            mapData: defaultMap<userTypes.User>,
        },
    });
}

export async function logoutUserMutation() {
    return createJsonMutation({
        request: {
            url: baseUrl('/logout'),
            method: 'POST',
        },
    });
}
