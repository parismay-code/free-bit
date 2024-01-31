import type IApiService from '@interfaces/api/IApiService';
import type { Collection } from '@interfaces/api/IApiService';
import type IOrganization from '@interfaces/models/IOrganization';
import type { IFullOrganization } from '@interfaces/models/IOrganization';

export default interface IOrganizationsApiService extends IApiService {
    getAll(): Promise<Collection<IOrganization> | false>;

    get(organizationId: number): Promise<IFullOrganization | false>;

    create(
        userId: number,
        data: IOrganizationRequest,
    ): Promise<IFullOrganization | false>;

    update(
        organizationId: number,
        userId: number,
        data: IOrganizationRequest,
    ): Promise<IFullOrganization | false>;

    delete(organizationId: number): Promise<boolean>;
}

export interface IOrganizationRequest {
    name: string;
    description?: string;
}
