import IOrganizationShift, {
    OrganizationShiftStatuses,
} from '@interfaces/models/IOrganizationShift';

export type Days = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

const days: Array<Days> = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

interface IShiftsSheet {
    hours: number;
    ended: boolean;
}

const calculateShifts = (
    shifts: Array<IOrganizationShift>,
): Record<Days, Array<IShiftsSheet>> => {
    const sheet: Record<Days, Array<IShiftsSheet>> = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: [],
    };

    shifts.forEach((shift) => {
        const date = new Date(shift.created_at);

        const endDate =
            shift.status === OrganizationShiftStatuses.ENDED
                ? new Date(shift.updated_at).getTime()
                : new Date().getTime() + 3 * 60 * 60 * 1000;

        const hours = endDate - date.getTime();

        const data: IShiftsSheet = {
            hours: Math.round(hours / 1000 / 60 / 60),
            ended: shift.status === OrganizationShiftStatuses.ENDED,
        };

        const day = days[date.getDay()];

        sheet[day].push(data);
    });

    return sheet;
};

export default calculateShifts;
