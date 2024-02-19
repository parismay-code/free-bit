import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type IOrganizationsApiService from '@interfaces/api/IOrganizationsApiService';
import type { Paginated } from '@interfaces/api/IApiService';
import type IOrganization from '@interfaces/models/IOrganization';
import type { IFullOrganization } from '@interfaces/models/IOrganization';
import ApiError from '@services/api/ApiError';
import IValidatedErrors from '@interfaces/api/IValidatedErrors';
import type { ValidatedReturnType } from '@interfaces/api/IAuthApiService';

export default class OrganizationsApiService
    extends ApiServiceBase
    implements IOrganizationsApiService
{
    public getAll = async (
        page: number,
        q: string | undefined,
    ): Promise<Paginated<IOrganization> | false> => {
        const endpoint = `/organizations?page=${page}${q ? `&query=${q}` : ''}`;

        const query = await this.fetch<Paginated<IOrganization>>(
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

    public create = async <F extends string = string>(
        data: FormData,
    ): ValidatedReturnType<F, IFullOrganization, FormData> => {
        const endpoint = '/organizations';

        const query = await this.fetch<
            { organization: IFullOrganization },
            FormData,
            IValidatedErrors<F>
        >('postForm', endpoint, data);

        if (!query) {
            return false;
        }

        if (query instanceof AxiosError) {
            if (query.response && query.response.status === 422) {
                return new ApiError<IValidatedErrors<F>, FormData>(query);
            }

            return false;
        }

        return query.data.organization;
    };

    public update = async <F extends string = string>(
        organizationId: number,
        data: FormData,
    ): ValidatedReturnType<F, IFullOrganization, FormData> => {
        const endpoint = `/organizations/${organizationId}`;

        const query = await this.fetch<
            { organization: IFullOrganization },
            FormData,
            IValidatedErrors<F>
        >('postForm', endpoint, data);

        if (!query) {
            return false;
        }

        if (query instanceof AxiosError) {
            if (query.response && query.response.status === 422) {
                return new ApiError<IValidatedErrors<F>, FormData>(query);
            }

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
