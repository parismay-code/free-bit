import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';
import ApiError from '@services/api/ApiError';

import IAuthApiService, {
    ValidatedReturnType,
    ILoginRequest,
    IRegisterRequest,
} from '@interfaces/api/IAuthApiService';
import { type IFullUser } from '@interfaces/models/IUser';
import IValidatedErrors from '@interfaces/api/IValidatedErrors';

export default class AuthApiService
    extends ApiServiceBase
    implements IAuthApiService
{
    public login = async <F extends string = string>(
        data: ILoginRequest,
    ): ValidatedReturnType<F, IFullUser, ILoginRequest> => {
        await this.csrfToken();

        const query = await this.fetch<
            {
                user: IFullUser;
            },
            ILoginRequest,
            IValidatedErrors<F>
        >('post', '/login', data);

        if (!query) {
            return false;
        }

        if (query instanceof AxiosError) {
            if (query.response && query.response.status === 422) {
                return new ApiError<IValidatedErrors<F>, ILoginRequest>(query);
            }

            return false;
        }

        return query.data.user;
    };

    public register = async <F extends string = string>(
        data: IRegisterRequest,
    ): ValidatedReturnType<F, IFullUser, IRegisterRequest> => {
        await this.csrfToken();

        const query = await this.fetch<
            {
                user: IFullUser;
            },
            IRegisterRequest,
            IValidatedErrors<F>
        >('post', '/register', data);

        if (!query) {
            return false;
        }

        if (query instanceof AxiosError) {
            if (query.response && query.response.status === 422) {
                return new ApiError<IValidatedErrors<F>, IRegisterRequest>(
                    query,
                );
            }

            return false;
        }

        return query.data.user;
    };

    public logout = async (): Promise<boolean> => {
        const query = await this.fetch('post', '/logout');

        return !(!query || query instanceof ApiError);
    };

    public user = async (): Promise<IFullUser | false> => {
        const query = await this.fetch<{ user: IFullUser }>('get', '/user');

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.user;
    };
}
