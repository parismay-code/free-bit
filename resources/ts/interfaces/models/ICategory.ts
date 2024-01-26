import type { Collection } from '@interfaces/api/IApiService';
import type IProduct from '@interfaces/models/IProduct';

export default interface ICategory {
    id: number;
    name: string;
    description: string;
    products: Collection<IProduct>;
}
