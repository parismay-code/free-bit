import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type IUsersApiService from '@interfaces/api/IUsersApiService';
import IUser, { type IFullUser } from '@interfaces/models/IUser';
import type { Collection } from '@interfaces/api/IApiService';

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
}
