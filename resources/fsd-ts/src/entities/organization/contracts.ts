import { z } from 'zod';
import { userContracts } from '~entities/user';

export const OrganizationSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    avatar: z.string(),
    banner: z.string(),
    employees_count: z.number(),
    owner: z.optional(userContracts.UserSchema),
});

export const OrganizationDtoSchema = z.object({
    name: z.string().max(28),
    description: z.optional(z.string().max(120)),
    avatar: z.optional(z.string()),
    banner: z.optional(z.string()),
    owner_uid: z.string(),
});
