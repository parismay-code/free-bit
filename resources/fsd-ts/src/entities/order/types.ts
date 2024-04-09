import { z } from 'zod';
import { OrderDtoSchema, OrderSchema } from './contracts';

export type Order = z.infer<typeof OrderSchema>;

export type OrderDto = z.infer<typeof OrderDtoSchema>;
