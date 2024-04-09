import { z } from 'zod';
import { type RoleSchema, RoleDtoSchema } from './contracts';

export type Role = z.infer<typeof RoleSchema>;

export type RoleDto = z.infer<typeof RoleDtoSchema>;
