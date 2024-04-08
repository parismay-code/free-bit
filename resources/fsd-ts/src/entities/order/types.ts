import { z } from 'zod';
import { OrderSchema } from './contracts';

export type Order = z.infer<typeof OrderSchema>;
