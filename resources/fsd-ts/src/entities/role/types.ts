import { z } from 'zod';
import type { RoleSchema } from './contracts';

export type Role = z.infer<typeof RoleSchema>;
