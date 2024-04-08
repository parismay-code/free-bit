import { z } from 'zod';
import { CategorySchema } from './contracts';

export type Category = z.infer<typeof CategorySchema>;
