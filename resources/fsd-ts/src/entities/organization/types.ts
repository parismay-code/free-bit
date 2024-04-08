import { z } from 'zod';
import { OrganizationSchema } from './contracts';

export type Organization = z.infer<typeof OrganizationSchema>;
