import type IOrganization from '@interfaces/models/IOrganization';
import type { Paginated } from '@interfaces/api/IApiService';
import type IUser from '@interfaces/models/IUser';

export default interface IOrganizationRole {
    id: number;
    name: string;
    description: string;
    priority: number;
}

export interface IFullOrganizationRole extends IOrganizationRole {
    organization: IOrganization;
    employees: Paginated<IUser>;
}
