import type { Collection } from '@interfaces/api/IApiService';
import type IIngredient from '@interfaces/models/IIngredient';
import type IOrganization from '@interfaces/models/IOrganization';
import type IOrder from '@interfaces/models/IOrder';
import type ICategory from '@interfaces/models/ICategory';

export default interface IProduct {
    id: number;
    name: string;
    description: string;
    ingredients: Collection<IIngredient>;
    price: number;
    count: number;
}

export interface IFullProduct extends IProduct {
    organization: IOrganization;
    orders: Collection<IOrder>;
    category: ICategory;
}
