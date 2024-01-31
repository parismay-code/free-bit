import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type IOrganizationsApiService from '@interfaces/api/IOrganizationsApiService';
import type { IOrganizationRequest } from '@interfaces/api/IOrganizationsApiService';
import type { Collection } from '@interfaces/api/IApiService';
import type IOrganization from '@interfaces/models/IOrganization';
import type { IFullOrganization } from '@interfaces/models/IOrganization';

export default class OrganizationsApiService
    extends ApiServiceBase
    implements IOrganizationsApiService
{
    public getAll = async (): Promise<Collection<IOrganization> | false> => {
        const endpoint = '/organizations';

        const query = await this.fetch<Collection<IOrganization>>(
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
    ): Promise<IFullOrganization | false> => {
        const endpoint = `/organizations/${organizationId}`;

        const query = await this.fetch<{ organization: IFullOrganization }>(
            'get',
            endpoint,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.organization;
    };

    public create = async (
        userId: number,
        data: IOrganizationRequest,
    ): Promise<IFullOrganization | false> => {
        const endpoint = `/organizations/owner/${userId}`;

        const query = await this.fetch<
            { organization: IFullOrganization },
            IOrganizationRequest
        >('post', endpoint, data);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.organization;
    };

    public update = async (
        organizationId: number,
        userId: number,
        data: IOrganizationRequest,
    ): Promise<IFullOrganization | false> => {
        const endpoint = `/organizations/${organizationId}/owner/${userId}`;

        const query = await this.fetch<
            { organization: IFullOrganization },
            IOrganizationRequest
        >('patch', endpoint, data);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.organization;
    };

    public delete = async (organizationId: number): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}`;

        const query = await this.fetch('delete', endpoint);

        return !(!query || query instanceof AxiosError);
    };
}
