import type IUser from '@interfaces/models/IUser';
import type { Collection } from '@interfaces/api/IApiService';
import type IProduct from '@interfaces/models/IProduct';
import type IOrganization from '@interfaces/models/IOrganization';

export default interface IOrder {
    id: number;
    status: OrderStatuses;
    delivery: boolean;
    courier: IUser | null;
    employee: IUser | null;
    created_at: string;
    updated_at: string;
}

export interface IFullOrder extends IOrder {
    organization: IOrganization;
    client: IUser;
    products: Collection<IProduct>;
}

export enum OrderStatuses {
    CREATED = 'created',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    COOKING = 'cooking',
    DELIVERING = 'delivering',
    FINISHED = 'finished',
    CLOSED_BY_CLIENT = 'cbc',
    CLOSED_BY_ORGANIZATION = 'cbo',
    CLOSED_BY_ADMINISTRATION = 'cba',
}
