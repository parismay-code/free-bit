import type { Collection } from '@interfaces/api/IApiService';
import type IIngredient from '@interfaces/models/IIngredient';

export default interface IProduct {
    id: number;
    name: string;
    description: string;
    ingredients: Collection<IIngredient>;
    price: number;
    count: number;
}
