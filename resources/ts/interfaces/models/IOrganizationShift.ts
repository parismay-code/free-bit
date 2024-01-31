import type IOrganization from '@interfaces/models/IOrganization';
import type IUser from '@interfaces/models/IUser';

export default interface IOrganizationShift {
    id: number;
    organization: IOrganization;
    employee: IUser;
    status: OrganizationShiftStatuses;
    created_at: string;
    updated_at: string;
}

export enum OrganizationShiftStatuses {
    STARTED = 'started',
    ENDED = 'ended',
}
