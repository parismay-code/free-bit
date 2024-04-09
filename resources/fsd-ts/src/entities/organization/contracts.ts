import { z } from 'zod';

export const OrganizationSchema = z.object({
    id: z.number(),
    name: z.string(),
    uid: z.string(),
    email: z.string(),
    phone: z.string(),
    avatar: z.string(),
});

export const OrganizationDtoSchema = z.object({
    name: z.string(),
    description: z.string(),
    avatar: z.string(),
    banner: z.string(),
    owner_uid: z.string(),
});
