import type IOrganization from '@interfaces/models/IOrganization';
import type { Collection } from '@interfaces/api/IApiService';
import type IProduct from '@interfaces/models/IProduct';

export default interface IIngredient {
    id: number;
    name: string;
    description: string;
    cost: number;
    count: number;
    storage: number;
}

export interface IFullIngredient extends IIngredient {
    organization: IOrganization;
    products: Collection<IProduct>;
}
