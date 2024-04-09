import { z } from 'zod';
import { OrganizationDtoSchema, OrganizationSchema } from './contracts';

export type Organization = z.infer<typeof OrganizationSchema>;

export type OrganizationDto = z.infer<typeof OrganizationDtoSchema>;
