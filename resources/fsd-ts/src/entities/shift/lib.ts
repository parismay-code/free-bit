import { Shift, Days, ShiftsSheet } from './types';

const days: Array<Days> = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function calculateShifts(
    shifts: Array<Shift>,
): Record<Days, Array<ShiftsSheet>> {
    const sheet: Record<Days, Array<ShiftsSheet>> = {
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
            shift.status === 'ended'
                ? new Date(shift.updated_at).getTime()
                : new Date().getTime() + 3 * 60 * 60 * 1000;

        const hours = endDate - date.getTime();

        const data: ShiftsSheet = {
            hours: Math.round(hours / 1000 / 60 / 60),
            ended: shift.status === 'ended',
        };

        const day = days[date.getDay()];

        sheet[day].push(data);
    });

    return sheet;
}
