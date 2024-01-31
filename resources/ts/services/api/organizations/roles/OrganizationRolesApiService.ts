import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type IOrganizationRolesApiService from '@interfaces/api/IOrganizationRolesApiService';
import type { IOrganizationRoleRequest } from '@interfaces/api/IOrganizationRolesApiService';
import type { Collection } from '@interfaces/api/IApiService';
import type IOrganizationRole from '@interfaces/models/IOrganizationRole';
import type { IFullOrganizationRole } from '@interfaces/models/IOrganizationRole';

export default class OrganizationRolesApiService
    extends ApiServiceBase
    implements IOrganizationRolesApiService
{
    public getAll = async (
        organizationId: number,
    ): Promise<Collection<IOrganizationRole> | false> => {
        const endpoint = `/organizations/${organizationId}/roles`;

        const query = await this.fetch<Collection<IOrganizationRole>>(
            'get',
            endpoint,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public get = async (
        organizationId: number,
        roleId: number,
    ): Promise<IFullOrganizationRole | false> => {
        const endpoint = `/organizations/${organizationId}/roles/${roleId}`;

        const query = await this.fetch<IFullOrganizationRole>('get', endpoint);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public create = async (
        organizationId: number,
        data: IOrganizationRoleRequest,
    ): Promise<IFullOrganizationRole | false> => {
        const endpoint = `/organizations/${organizationId}/roles`;

        const query = await this.fetch<IFullOrganizationRole>(
            'post',
            endpoint,
            data,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public update = async (
        organizationId: number,
        roleId: number,
        data: IOrganizationRoleRequest,
    ): Promise<IFullOrganizationRole | false> => {
        const endpoint = `/organizations/${organizationId}/roles/${roleId}`;

        const query = await this.fetch<IFullOrganizationRole>(
            'patch',
            endpoint,
            data,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public delete = async (
        organizationId: number,
        roleId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/roles/${roleId}`;

        const query = await this.fetch('delete', endpoint);

        return !(!query || query instanceof AxiosError);
    };

    public attach = async (
        organizationId: number,
        userId: number,
        roleId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/employees/${userId}/roles/${roleId}/attach`;

        const query = await this.fetch('post', endpoint);

        return !(!query || query instanceof AxiosError);
    };

    public detach = async (
        organizationId: number,
        userId: number,
        roleId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/employees/${userId}/roles/${roleId}/detach`;

        const query = await this.fetch('post', endpoint);

        return !(!query || query instanceof AxiosError);
    };
}
