import { z } from 'zod';
import { ProductDtoSchema, ProductSchema } from './contracts';

export type Product = z.infer<typeof ProductSchema>;

export type ProductDto = z.infer<typeof ProductDtoSchema>;
