import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';
import ApiError from '@services/api/ApiError';

import IAuthErrors from '@interfaces/api/IAuthErrors';
import type IUsersApiService from '@interfaces/api/IUsersApiService';
import IUser, { type IFullUser } from '@interfaces/models/IUser';
import type { Collection } from '@interfaces/api/IApiService';
import { type AuthReturnType } from '@interfaces/api/IAuthApiService';

export default class UsersApiService
    extends ApiServiceBase
    implements IUsersApiService
{
    public getAll = async (): Promise<Collection<IUser> | false> => {
        const query = await this.fetch<Collection<IUser>>('get', '/users');

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public get = async (userId: number): Promise<IFullUser | false> => {
        const query = await this.fetch<{ user: IFullUser }>(
            'get',
            `/user/${userId}`,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.user;
    };

    public update = async <F extends string = string>(
        userId: number,
        data: FormData,
    ): AuthReturnType<F, FormData> => {
        const query = await this.fetch<
            { user: IFullUser },
            FormData,
            IAuthErrors<F>
        >('postForm', `/user/${userId}`, data);

        if (!query) {
            return false;
        }

        if (query instanceof AxiosError) {
            if (query.response && query.response.status === 422) {
                return new ApiError<IAuthErrors<F>, FormData>(query);
            }

            return false;
        }

        return query.data.user;
    };

    public delete = async (userId: number): Promise<boolean> => {
        const query = await this.fetch('delete', `/user/${userId}`);

        return !(!query || query instanceof AxiosError);
    };
}
