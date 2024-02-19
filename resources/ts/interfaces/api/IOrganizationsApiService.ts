import type IApiService from '@interfaces/api/IApiService';
import type { Collection } from '@interfaces/api/IApiService';
import type IOrganization from '@interfaces/models/IOrganization';
import type { IFullOrganization } from '@interfaces/models/IOrganization';
import type { ValidatedReturnType } from '@interfaces/api/IAuthApiService.ts';

export default interface IOrganizationsApiService extends IApiService {
    getAll(
        page: number,
        q: string | undefined,
    ): Promise<Collection<IOrganization> | false>;

    get(organizationId: number): Promise<IFullOrganization | false>;

    create<F extends string = string>(
        data: FormData,
    ): ValidatedReturnType<F, IFullOrganization, FormData>;

    update<F extends string = string>(
        organizationId: number,
        data: FormData,
    ): ValidatedReturnType<F, IFullOrganization, FormData>;

    delete(organizationId: number): Promise<boolean>;
}

export interface IOrganizationRequest {
    name?: string;
    description?: string;
    avatar?: string;
    banner?: string;
    owner_uid?: string;
}
