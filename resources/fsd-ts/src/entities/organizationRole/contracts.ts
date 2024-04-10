import { z } from 'zod';

export const OrganizationRoleSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    priority: z.number(),
});

export const OrganizationRoleDtoSchema = z.object({
    name: z.string().max(28),
    description: z.string().max(120),
    priority: z.number().max(900),
});
