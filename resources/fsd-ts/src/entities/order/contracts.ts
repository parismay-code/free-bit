import { z } from 'zod';
import { userContracts } from '~entities/user';

const STATUSES = z.enum([
    'created',
    'accepted',
    'declined',
    'cooking',
    'delivering',
    'finished',
    'cbc',
    'cbo',
    'cba',
]);

export const OrderSchema = z.object({
    id: z.number(),
    status: STATUSES,
    delivery: z.boolean(),
    courier: userContracts.UserSchema,
    employee: userContracts.UserSchema,
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const OrderDtoSchema = z.object({
    status: STATUSES,
    delivery: z.optional(z.boolean()),
});
