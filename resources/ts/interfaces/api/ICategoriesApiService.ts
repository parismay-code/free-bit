import IApiService, { type Collection } from '@interfaces/api/IApiService';
import type ICategory from '@interfaces/models/ICategory';
import type { IFullCategory } from '@interfaces/models/ICategory';

export default interface ICategoriesApiService extends IApiService {
    getAll(organizationId: number): Promise<Collection<ICategory> | false>;

    get(
        organizationId: number,
        categoryId: number,
    ): Promise<IFullCategory | false>;

    create(
        organizationId: number,
        data: ICategoryRequest,
    ): Promise<IFullCategory | false>;

    update(
        organizationId: number,
        categoryId: number,
        data: ICategoryRequest,
    ): Promise<IFullCategory | false>;

    delete(organizationId: number, categoryId: number): Promise<boolean>;
}

export interface ICategoryRequest {
    name: string;
    description: string;
}
