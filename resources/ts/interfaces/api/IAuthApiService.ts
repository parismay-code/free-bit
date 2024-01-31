import type IApiService from '@interfaces/api/IApiService';
import IUser from '@interfaces/models/IUser';
import IAuthErrors from '@interfaces/api/IAuthErrors';

import ApiError from '@services/api/ApiError';

export default interface IAuthApiService extends IApiService {
    login<F extends string = string>(
        data: ILoginRequest,
    ): AuthReturnType<F, ILoginRequest>;

    register<F extends string = string>(
        data: IRegisterRequest,
    ): AuthReturnType<F, IRegisterRequest>;

    logout(): Promise<boolean>;

    user(): Promise<IUser | false>;
}

export type AuthReturnType<F extends string, D> = Promise<
    IUser | ApiError<IAuthErrors<F>, D> | false
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
