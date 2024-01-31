import type IApiService from '@interfaces/api/IApiService';
import type {
    IAttachWitchCountRequest,
    Collection,
} from '@interfaces/api/IApiService';
import type IIngredient from '@interfaces/models/IIngredient';
import type { IFullIngredient } from '@interfaces/models/IIngredient';

export default interface IIngredientsApiService extends IApiService {
    getAll(organizationId: number): Promise<Collection<IIngredient> | false>;

    get(
        organizationId: number,
        ingredientId: number,
    ): Promise<IFullIngredient | false>;

    create(
        organizationId: number,
        data: IIngredientRequest,
    ): Promise<IFullIngredient | false>;

    update(
        organizationId: number,
        ingredientId: number,
        data: IIngredientRequest,
    ): Promise<IFullIngredient | false>;

    delete(organizationId: number, ingredientId: number): Promise<boolean>;

    attach(
        organizationId: number,
        productId: number,
        ingredientId: number,
        data: IAttachWitchCountRequest,
    ): Promise<boolean>;

    detach(
        organizationId: number,
        productId: number,
        ingredientId: number,
    ): Promise<boolean>;
}

export interface IIngredientRequest {
    name: string;
    description?: string;
    cost: number;
}
