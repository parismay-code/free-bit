import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type IIngredientsApiService from '@interfaces/api/IIngredientsApiService';
import type { IIngredientRequest } from '@interfaces/api/IIngredientsApiService';
import type {
    Collection,
    IAttachWitchCountRequest,
} from '@interfaces/api/IApiService';
import type IIngredient from '@interfaces/models/IIngredient';
import type { IFullIngredient } from '@interfaces/models/IIngredient';

export default class IngredientsApiService
    extends ApiServiceBase
    implements IIngredientsApiService
{
    public getAll = async (
        organizationId: number,
    ): Promise<Collection<IIngredient> | false> => {
        const endpoint = `/organizations/${organizationId}/ingredients`;

        const query = await this.fetch<Collection<IIngredient>>(
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
        ingredientId: number,
    ): Promise<IFullIngredient | false> => {
        const endpoint = `/organizations/${organizationId}/ingredients/${ingredientId}`;

        const query = await this.fetch<{ ingredient: IFullIngredient }>(
            'get',
            endpoint,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.ingredient;
    };

    public create = async (
        organizationId: number,
        data: IIngredientRequest,
    ): Promise<IFullIngredient | false> => {
        const endpoint = `/organizations/${organizationId}/ingredients`;

        const query = await this.fetch<
            { ingredient: IFullIngredient },
            IIngredientRequest
        >('post', endpoint, data);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.ingredient;
    };

    public update = async (
        organizationId: number,
        ingredientId: number,
        data: IIngredientRequest,
    ): Promise<IFullIngredient | false> => {
        const endpoint = `/organizations/${organizationId}/ingredients/${ingredientId}`;

        const query = await this.fetch<
            { ingredient: IFullIngredient },
            IIngredientRequest
        >('patch', endpoint, data);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.ingredient;
    };

    public delete = async (
        organizationId: number,
        ingredientId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/ingredients/${ingredientId}`;

        const query = await this.fetch('delete', endpoint);

        return !(!query || query instanceof AxiosError);
    };

    public attach = async (
        organizationId: number,
        productId: number,
        ingredientId: number,
        data: IAttachWitchCountRequest,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/products/${productId}/ingredients/${ingredientId}/attach`;

        const query = await this.fetch<unknown, IAttachWitchCountRequest>(
            'post',
            endpoint,
            data,
        );

        return !(!query || query instanceof AxiosError);
    };

    public detach = async (
        organizationId: number,
        productId: number,
        ingredientId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/products/${productId}/ingredients/${ingredientId}/detach`;

        const query = await this.fetch('post', endpoint);

        return !(!query || query instanceof AxiosError);
    };
}
