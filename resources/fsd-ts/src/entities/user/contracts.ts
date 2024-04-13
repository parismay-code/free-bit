import { z } from 'zod';
import { roleContracts } from '~entities/role';
import { CollectionSchema } from '~shared/contracts';

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    uid: z.string(),
    email: z.string(),
    phone: z.string(),
    avatar: z.string().nullable(),
    roles: CollectionSchema(roleContracts.RoleSchema),
    organization_id: z.number().nullable(),
});

export const UserDtoSchema = z.object({
    name: z.optional(z.string().max(28)),
    uid: z.optional(z.string().max(6)),
    email: z.optional(z.string()),
    phone: z.optional(z.string()),
    avatar: z.optional(z.string()),
    password: z.string(),
    new_password: z.optional(z.string().min(8)),
    new_password_confirmation: z.optional(z.string().min(8)),
});
