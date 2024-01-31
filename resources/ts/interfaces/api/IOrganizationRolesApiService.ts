import type IApiService from '@interfaces/api/IApiService';
import type { Collection } from '@interfaces/api/IApiService';
import type IOrganizationRole from '@interfaces/models/IOrganizationRole';
import type { IFullOrganizationRole } from '@interfaces/models/IOrganizationRole';

export default interface IOrganizationRolesApiService extends IApiService {
    getAll(
        organizationId: number,
    ): Promise<Collection<IOrganizationRole> | false>;

    get(
        organizationId: number,
        organizationRoleId: number,
    ): Promise<IFullOrganizationRole | false>;

    create(
        organizationId: number,
        data: IOrganizationRoleRequest,
    ): Promise<IFullOrganizationRole | false>;

    update(
        organizationId: number,
        organizationRoleId: number,
        data: IOrganizationRoleRequest,
    ): Promise<IFullOrganizationRole | false>;

    delete(
        organizationId: number,
        organizationRoleId: number,
    ): Promise<boolean>;

    attach(
        organizationId: number,
        userId: number,
        organizationRoleId: number,
    ): Promise<boolean>;

    detach(
        organizationId: number,
        userId: number,
        organizationRoleId: number,
    ): Promise<boolean>;
}

export interface IOrganizationRoleRequest {
    name: string;
    description?: string;
    priority: number;
}
