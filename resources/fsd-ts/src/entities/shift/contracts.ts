import { z } from 'zod';
import { organizationContracts } from '~entities/organization';
import { userContracts } from '~entities/user';

const STATUSES = z.enum(['started', 'ended']);

export const ShiftSchema = z.object({
    id: z.number(),
    organization: organizationContracts.OrganizationSchema,
    employee: userContracts.UserSchema,
    status: STATUSES,
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const ShiftDtoSchema = z.object({
    status: STATUSES,
});
