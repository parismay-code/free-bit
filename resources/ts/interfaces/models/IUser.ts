import type { Collection } from '@interfaces/api/IApiService';
import type IRole from '@interfaces/models/IRole';
import type IOrder from '@interfaces/models/IOrder';
import type IOrganization from '@interfaces/models/IOrganization';
import type IOrganizationRole from '@interfaces/models/IOrganizationRole';
import type IOrganizationShift from '@interfaces/models/IOrganizationShift';

export default interface IUser {
    id: number;
    name: string;
    uid: string;
    email: string;
    phone: string;
}

export interface IFullUser extends IUser {
    roles: Collection<IRole>;
    orders: {
        created: Collection<IOrder>;
        handled: Collection<IOrder>;
        delivered: Collection<IOrder>;
    };
    organization: {
        data: IOrganization | null;
        roles: Collection<IOrganizationRole>;
        shifts: Collection<IOrganizationShift>;
    };
    ownedOrganization: IOrganization | null;
}

export interface IEmployee extends IUser {
    roles: Collection<IRole>;
    orders: Collection<IOrder>;
    organization: {
        data: IOrganization;
        roles: Collection<IOrganizationRole>;
        shifts: Collection<IOrganizationShift>;
    };
}
