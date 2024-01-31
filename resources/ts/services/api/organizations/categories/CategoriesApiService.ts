import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type ICategoriesApiService from '@interfaces/api/ICategoriesApiService';
import type { ICategoryRequest } from '@interfaces/api/ICategoriesApiService';
import type { Collection } from '@interfaces/api/IApiService';
import type ICategory from '@interfaces/models/ICategory';
import type { IFullCategory } from '@interfaces/models/ICategory';

export default class CategoriesApiService
    extends ApiServiceBase
    implements ICategoriesApiService
{
    public getAll = async (
        organizationId: number,
    ): Promise<Collection<ICategory> | false> => {
        const endpoint = `/organizations/${organizationId}/categories`;

        const query = await this.fetch<Collection<ICategory>>('get', endpoint);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public get = async (
        organizationId: number,
        categoryId: number,
    ): Promise<IFullCategory | false> => {
        const endpoint = `/organizations/${organizationId}/categories/${categoryId}`;

        const query = await this.fetch<{ category: IFullCategory }>(
            'get',
            endpoint,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.category;
    };

    public create = async (
        organizationId: number,
        data: ICategoryRequest,
    ): Promise<IFullCategory | false> => {
        const endpoint = `/organizations/${organizationId}/categories`;

        const query = await this.fetch<
            { category: IFullCategory },
            ICategoryRequest
        >('post', endpoint, data);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.category;
    };

    public update = async (
        organizationId: number,
        categoryId: number,
        data: ICategoryRequest,
    ): Promise<IFullCategory | false> => {
        const endpoint = `/organizations/${organizationId}/categories/${categoryId}`;

        const query = await this.fetch<
            { category: IFullCategory },
            ICategoryRequest
        >('patch', endpoint, data);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.category;
    };

    public delete = async (
        organizationId: number,
        categoryId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/categories/${categoryId}`;

        const query = await this.fetch('delete', endpoint);

        return !(!query || query instanceof AxiosError);
    };
}
