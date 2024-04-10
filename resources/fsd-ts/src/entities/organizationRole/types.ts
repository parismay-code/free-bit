import { z } from 'zod';
import {
    type OrganizationRoleSchema,
    OrganizationRoleDtoSchema,
} from './contracts';

export type OrganizationRole = z.infer<typeof OrganizationRoleSchema>;

export type OrganizationRoleDto = z.infer<typeof OrganizationRoleDtoSchema>;
