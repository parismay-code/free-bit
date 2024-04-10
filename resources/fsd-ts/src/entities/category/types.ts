import { z } from 'zod';
import { CategoryDtoSchema, CategorySchema } from './contracts';

export type Category = z.infer<typeof CategorySchema>;

export type CategoryDto = z.infer<typeof CategoryDtoSchema>;
