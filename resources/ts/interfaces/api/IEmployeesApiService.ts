import type IApiService from '@interfaces/api/IApiService';
import type { Collection } from '@interfaces/api/IApiService';
import IUser, { type IEmployee } from '@interfaces/models/IUser';

export default interface IEmployeesApiService extends IApiService {
    getAll(organizationId: number): Promise<Collection<IUser> | false>;

    get(organizationId: number, userId: number): Promise<IEmployee | false>;

    associate(organizationId: number, userId: number): Promise<boolean>;

    dissociate(organizationId: number, userId: number): Promise<boolean>;
}
