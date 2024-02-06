import type IUser from '@interfaces/models/IUser';
import type { Collection, Paginated } from '@interfaces/api/IApiService';
import type IIngredient from '@interfaces/models/IIngredient';
import type IProduct from '@interfaces/models/IProduct';
import type ICategory from '@interfaces/models/ICategory';
import type IOrder from '@interfaces/models/IOrder';

export default interface IOrganization {
    id: number;
    name: string;
    description: string;
    owner: IUser;
    avatar: string | null;
    banner: string | null;
    employees_count: number;
}

export interface IFullOrganization extends IOrganization {
    employees: Paginated<IUser>;
    orders: Collection<IOrder>;
    categories: Collection<ICategory>;
    products: Collection<IProduct>;
    ingredients: Collection<IIngredient>;
}
