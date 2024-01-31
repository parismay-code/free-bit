import { AxiosError } from 'axios';

import ApiServiceBase from '@services/api/ApiServiceBase';

import type IEmployeeShiftsApiService from '@interfaces/api/IEmployeeShiftsApiService';
import type { IEmployeeShiftRequest } from '@interfaces/api/IEmployeeShiftsApiService';
import type IOrganizationShift from '@interfaces/models/IOrganizationShift';

export default class OrganizationShiftsApiService
    extends ApiServiceBase
    implements IEmployeeShiftsApiService
{
    public create = async (
        organizationId: number,
        userId: number,
        data: IEmployeeShiftRequest,
    ): Promise<IOrganizationShift | false> => {
        const endpoint = `/organizations/${organizationId}/employee/${userId}/shifts`;

        const query = await this.fetch<
            { shift: IOrganizationShift },
            IEmployeeShiftRequest
        >('post', endpoint, data);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.shift;
    };

    public update = async (
        organizationId: number,
        userId: number,
        shiftId: number,
        data: IEmployeeShiftRequest,
    ): Promise<IOrganizationShift | false> => {
        const endpoint = `/organizations/${organizationId}/employee/${userId}/shifts/${shiftId}`;

        const query = await this.fetch<
            { shift: IOrganizationShift },
            IEmployeeShiftRequest
        >('patch', endpoint, data);

        if (!query || query instanceof AxiosError) {
            return false;
        }

        return query.data.shift;
    };

    public delete = async (
        organizationId: number,
        userId: number,
        shiftId: number,
    ): Promise<boolean> => {
        const endpoint = `/organizations/${organizationId}/employee/${userId}/shifts/${shiftId}`;

        const query = await this.fetch('delete', endpoint);

        return !(!query || query instanceof AxiosError);
    };
}
