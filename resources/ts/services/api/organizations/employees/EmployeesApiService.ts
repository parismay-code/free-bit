import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type IEmployeesApiService from '@interfaces/api/IEmployeesApiService';
import type { Collection } from '@interfaces/api/IApiService';
import IUser, { type IEmployee } from '@interfaces/models/IUser';

export default class EmployeesApiService
    extends ApiServiceBase
    implements IEmployeesApiService
{
    public getAll = async (
        organizationId: number,
    ): Promise<Collection<IUser> | false> => {
        const endpoint = `/organizations/${organizationId}/employees`;

        const query = await this.fetch<Collection<IUser>>('get', endpoint);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public get = async (
        organizationId: number,
        userId: number,
    ): Promise<IEmployee | false> => {
        const endpoint = `/organizations/${organizationId}/employees/${userId}`;

        const query = await this.fetch<{ employee: IEmployee }>(
            'get',
            endpoint,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.employee;
    };

    public associate = async (
        organizationId: number,
        userId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/employees/${userId}/associate`;

        const query = await this.fetch('post', endpoint);

        return !(!query || query instanceof AxiosError);
    };

    public dissociate = async (
        organizationId: number,
        userId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/employees/${userId}/dissociate`;

        const query = await this.fetch('post', endpoint);

        return !(!query || query instanceof AxiosError);
    };
}
