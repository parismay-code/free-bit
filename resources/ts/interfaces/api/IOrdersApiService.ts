import type IApiService from '@interfaces/api/IApiService';
import type { Collection } from '@interfaces/api/IApiService';
import IOrder, {
    type IFullOrder,
    OrderStatuses,
} from '@interfaces/models/IOrder';

export default interface IOrdersApiService extends IApiService {
    getAll(
        organizationId: number,
        status: OrderRequestStatuses,
    ): Promise<Collection<IOrder> | false>;

    get(organizationId: number, orderId: number): Promise<IFullOrder | false>;

    create(
        organizationId: number,
        data: IOrderRequest,
    ): Promise<IFullOrder | false>;

    update(
        organizationId: number,
        orderId: number,
        data: IOrderRequest,
    ): Promise<IFullOrder | false>;

    delete(organizationId: number, orderId: number): Promise<boolean>;

    associateCourier(
        organizationId: number,
        orderId: number,
        userId: number,
    ): Promise<boolean>;

    associateEmployee(
        organizationId: number,
        orderId: number,
        userId: number,
    ): Promise<boolean>;
}

export interface IOrderRequest {
    status: OrderStatuses;
    delivery?: boolean;
}

export type OrderRequestStatuses = 'active' | 'finished' | 'closed';
