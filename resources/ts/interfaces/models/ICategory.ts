import type { Collection } from '@interfaces/api/IApiService';
import type IProduct from '@interfaces/models/IProduct';
import type IOrganization from '@interfaces/models/IOrganization';

export default interface ICategory {
    id: number;
    name: string;
    description: string;
    products: Collection<IProduct>;
}

export interface IFullCategory extends ICategory {
    organization: IOrganization;
}
