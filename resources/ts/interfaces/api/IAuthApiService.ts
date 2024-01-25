import IUser from '@interfaces/models/IUser';
import IAuthErrors from '@interfaces/api/IAuthErrors';

import ApiError from '@services/api/ApiError';

export default interface IAuthApiService {
    login<F extends string = string>(data: ILoginRequest): AuthReturnType<F>;

    register<F extends string = string>(
        data: IRegisterRequest,
    ): AuthReturnType<F>;

    logout(): Promise<boolean>;

    user(): Promise<IUser | false>;
}

export type AuthReturnType<F extends string> = Promise<
    IUser | ApiError<IAuthErrors<F>, ILoginRequest> | false
>;

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
