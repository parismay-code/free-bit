import type IApiService from '@interfaces/api/IApiService';
import IOrganizationShift, {
    OrganizationShiftStatuses,
} from '@interfaces/models/IOrganizationShift';

export default interface IEmployeeShiftsApiService extends IApiService {
    create(
        organizationId: number,
        userId: number,
        data: IEmployeeShiftRequest,
    ): Promise<IOrganizationShift | false>;

    update(
        organizationId: number,
        userId: number,
        shiftId: number,
        data: IEmployeeShiftRequest,
    ): Promise<IOrganizationShift | false>;

    delete(
        organizationId: number,
        userId: number,
        shiftId: number,
    ): Promise<boolean>;
}

export interface IEmployeeShiftRequest {
    status: OrganizationShiftStatuses;
}
