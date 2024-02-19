import type IApiService from '@interfaces/api/IApiService';
import { type IFullUser } from '@interfaces/models/IUser';
import IValidatedErrors from '@interfaces/api/IValidatedErrors';

import ApiError from '@services/api/ApiError';

export default interface IAuthApiService extends IApiService {
    login<F extends string = string>(
        data: ILoginRequest,
    ): ValidatedReturnType<F, IFullUser, ILoginRequest>;

    register<F extends string = string>(
        data: IRegisterRequest,
    ): ValidatedReturnType<F, IFullUser, IRegisterRequest>;

    logout(): Promise<boolean>;

    user(): Promise<IFullUser | false>;
}

export type ValidatedReturnType<F extends string, R, D> = Promise<
    R | ApiError<IValidatedErrors<F>, D> | false
>;

export interface ILoginRequest {
    uid: string;
    password: string;
}

export interface IRegisterRequest {
    name: string;
    uid: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
}
