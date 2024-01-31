import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type IRolesApiService from '@interfaces/api/IRolesApiService';
import type { IRoleRequest } from '@interfaces/api/IRolesApiService';
import type { Collection } from '@interfaces/api/IApiService';
import type IRole from '@interfaces/models/IRole';
import type { IFullRole } from '@interfaces/models/IRole';

export default class RolesApiService
    extends ApiServiceBase
    implements IRolesApiService
{
    public getAll = async (): Promise<Collection<IRole> | false> => {
        const endpoint = '/roles';

        const query = await this.fetch<Collection<IRole>>('get', endpoint);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public get = async (roleId: number): Promise<IFullRole | false> => {
        const endpoint = `/roles/${roleId}`;

        const query = await this.fetch<{ role: IFullRole }>('get', endpoint);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.role;
    };

    public create = async (data: IRoleRequest): Promise<IFullRole | false> => {
        const endpoint = '/roles';

        const query = await this.fetch<{ role: IFullRole }, IRoleRequest>(
            'post',
            endpoint,
            data,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.role;
    };

    public update = async (
        roleId: number,
        data: IRoleRequest,
    ): Promise<IFullRole | false> => {
        const endpoint = `/roles/${roleId}`;

        const query = await this.fetch<{ role: IFullRole }, IRoleRequest>(
            'patch',
            endpoint,
            data,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.role;
    };

    public delete = async (roleId: number): Promise<boolean> => {
        const endpoint = `/roles/${roleId}`;

        const query = await this.fetch('delete', endpoint);

        return !(!query || query instanceof AxiosError);
    };

    public attach = async (
        userId: number,
        roleId: number,
    ): Promise<boolean> => {
        const endpoint = `/users/${userId}/roles/${roleId}/attach`;

        const query = await this.fetch('post', endpoint);

        return !(!query || query instanceof AxiosError);
    };

    public detach = async (
        userId: number,
        roleId: number,
    ): Promise<boolean> => {
        const endpoint = `/users/${userId}/roles/${roleId}/detach`;

        const query = await this.fetch('post', endpoint);

        return !(!query || query instanceof AxiosError);
    };
}
