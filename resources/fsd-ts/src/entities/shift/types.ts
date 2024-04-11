import { z } from 'zod';
import { ShiftDtoSchema, ShiftSchema } from './contracts';

export type Shift = z.infer<typeof ShiftSchema>;

export type ShiftDto = z.infer<typeof ShiftDtoSchema>;

export type Days = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type ShiftsSheet = {
    hours: number;
    ended: boolean;
};
