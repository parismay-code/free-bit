import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type IProductsApiService from '@interfaces/api/IProductsApiService';
import type { IProductRequest } from '@interfaces/api/IProductsApiService';
import type { Collection } from '@interfaces/api/IApiService';
import type IProduct from '@interfaces/models/IProduct';
import type { IFullProduct } from '@interfaces/models/IProduct';

export default class ProductsApiService
    extends ApiServiceBase
    implements IProductsApiService
{
    public getAll = async (
        organizationId: number,
    ): Promise<Collection<IProduct> | false> => {
        const endpoint = `/organizations/${organizationId}/products`;

        const query = await this.fetch<Collection<IProduct>>('get', endpoint);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public get = async (
        organizationId: number,
        productId: number,
    ): Promise<IFullProduct | false> => {
        const endpoint = `/organizations/${organizationId}/products/${productId}`;

        const query = await this.fetch<{ product: IFullProduct }>(
            'get',
            endpoint,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.product;
    };

    public create = async (
        organizationId: number,
        categoryId: number,
        data: IProductRequest,
    ): Promise<IFullProduct | false> => {
        const endpoint = `/organizations/${organizationId}/categories/${categoryId}/products`;

        const query = await this.fetch<
            { product: IFullProduct },
            IProductRequest
        >('post', endpoint, data);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.product;
    };

    public update = async (
        organizationId: number,
        categoryId: number,
        productId: number,
        data: IProductRequest,
    ): Promise<IFullProduct | false> => {
        const endpoint = `/organizations/${organizationId}/categories/${categoryId}/products/${productId}`;

        const query = await this.fetch<
            { product: IFullProduct },
            IProductRequest
        >('patch', endpoint, data);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.product;
    };

    public delete = async (
        organizationId: number,
        productId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/products/${productId}`;

        const query = await this.fetch('delete', endpoint);

        return !(!query || query instanceof AxiosError);
    };
}
