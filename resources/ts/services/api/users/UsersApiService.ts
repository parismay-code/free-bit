import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';
import ApiError from '@services/api/ApiError';

import IValidatedErrors from '@interfaces/api/IValidatedErrors';
import type IUsersApiService from '@interfaces/api/IUsersApiService';
import IUser, { type IFullUser } from '@interfaces/models/IUser';
import type { Paginated } from '@interfaces/api/IApiService';
import { type ValidatedReturnType } from '@interfaces/api/IAuthApiService';

export default class UsersApiService
    extends ApiServiceBase
    implements IUsersApiService
{
    public getAll = async (
        page: number,
        q: undefined | string,
    ): Promise<Paginated<IUser> | false> => {
        const query = await this.fetch<Paginated<IUser>>(
            'get',
            `/users?page=${page}${q ? `&query=${q}` : ''}`,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public get = async (userId: number): Promise<IFullUser | false> => {
        const query = await this.fetch<{ user: IFullUser }>(
            'get',
            `/users/${userId}`,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.user;
    };

    public update = async <F extends string = string>(
        userId: number,
        data: FormData,
    ): ValidatedReturnType<F, IFullUser, FormData> => {
        const query = await this.fetch<
            { user: IFullUser },
            FormData,
            IValidatedErrors<F>
        >('postForm', `/users/${userId}`, data);

        if (!query) {
            return false;
        }

        if (query instanceof AxiosError) {
            if (query.response && query.response.status === 422) {
                return new ApiError<IValidatedErrors<F>, FormData>(query);
            }

            return false;
        }

        return query.data.user;
    };

    public delete = async (userId: number): Promise<boolean> => {
        const query = await this.fetch('delete', `/users/${userId}`);

        return !(!query || query instanceof AxiosError);
    };
}
