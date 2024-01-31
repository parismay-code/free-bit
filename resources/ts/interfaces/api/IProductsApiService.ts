import type IApiService from '@interfaces/api/IApiService';
import type { Collection } from '@interfaces/api/IApiService';
import type IProduct from '@interfaces/models/IProduct';
import type { IFullProduct } from '@interfaces/models/IProduct';

export default interface IProductsApiService extends IApiService {
    getAll(organizationId: number): Promise<Collection<IProduct> | false>;

    get(
        organizationId: number,
        productId: number,
    ): Promise<IFullProduct | false>;

    create(
        organizationId: number,
        categoryId: number,
        data: IProductRequest,
    ): Promise<IFullProduct | false>;

    update(
        organizationId: number,
        categoryId: number,
        productId: number,
        data: IProductRequest,
    ): Promise<IFullProduct | false>;

    delete(organizationId: number, productId: number): Promise<boolean>;
}

export interface IProductRequest {
    name: string;
    description?: string;
    price: number;
}
