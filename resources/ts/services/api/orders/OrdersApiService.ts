import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type IOrdersApiService from '@interfaces/api/IOrdersApiService';
import type {
    OrderRequestStatuses,
    IOrderRequest,
} from '@interfaces/api/IOrdersApiService';
import type { Collection } from '@interfaces/api/IApiService';
import type IOrder from '@interfaces/models/IOrder';
import type { IFullOrder } from '@interfaces/models/IOrder';

export default class OrdersApiService
    extends ApiServiceBase
    implements IOrdersApiService
{
    public getAll = async (
        organizationId: number,
        status: OrderRequestStatuses,
    ): Promise<Collection<IOrder> | false> => {
        const endpoint = `/organizations/${organizationId}/orders?status=${status}`;

        const query = await this.fetch<Collection<IOrder>>('get', endpoint);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data;
    };

    public get = async (
        organizationId: number,
        orderId: number,
    ): Promise<IFullOrder | false> => {
        const endpoint = `/organizations/${organizationId}/orders/${orderId}`;

        const query = await this.fetch<{ order: IFullOrder }>('get', endpoint);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.order;
    };

    public create = async (
        organizationId: number,
        data: IOrderRequest,
    ): Promise<IFullOrder | false> => {
        const endpoint = `/organizations/${organizationId}/orders`;

        const query = await this.fetch<{ order: IFullOrder }, IOrderRequest>(
            'post',
            endpoint,
            data,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.order;
    };

    public update = async (
        organizationId: number,
        orderId: number,
        data: IOrderRequest,
    ): Promise<IFullOrder | false> => {
        const endpoint = `/organizations/${organizationId}/orders/${orderId}`;

        const query = await this.fetch<{ order: IFullOrder }, IOrderRequest>(
            'patch',
            endpoint,
            data,
        );

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.order;
    };

    public delete = async (
        organizationId: number,
        orderId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/orders/${orderId}`;

        const query = await this.fetch('delete', endpoint);

        return !(!query || query instanceof AxiosError);
    };

    public associateCourier = async (
        organizationId: number,
        orderId: number,
        userId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/orders/${orderId}/courier/${userId}`;

        const query = await this.fetch('post', endpoint);

        return !(!query || query instanceof AxiosError);
    };

    public associateEmployee = async (
        organizationId: number,
        orderId: number,
        userId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/orders/${orderId}/employee/${userId}`;

        const query = await this.fetch('post', endpoint);

        return !(!query || query instanceof AxiosError);
    };
}
