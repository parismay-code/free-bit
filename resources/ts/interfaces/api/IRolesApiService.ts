import type IApiService from '@interfaces/api/IApiService';
import type { Collection } from '@interfaces/api/IApiService';
import IRole, { type IFullRole } from '@interfaces/models/IRole';

export default interface IRolesApiService extends IApiService {
    getAll(): Promise<Collection<IRole> | false>;

    get(roleId: number): Promise<IFullRole | false>;

    create(data: IRoleRequest): Promise<IFullRole | false>;

    update(roleId: number, data: IRoleRequest): Promise<IFullRole | false>;

    delete(roleId: number): Promise<boolean>;

    attach(userId: number, roleId: number): Promise<boolean>;

    detach(userId: number, roleId: number): Promise<boolean>;
}

export interface IRoleRequest {
    name: string;
    description?: string;
}
