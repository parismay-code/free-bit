import { z } from 'zod';
import { productContracts } from '~entities/product';
import { CollectionSchema } from '~shared/contracts';

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    products: CollectionSchema(productContracts.ProductSchema),
});

export const CategoryDtoSchema = z.object({
    name: z.string().max(28),
    description: z.optional(z.string().max(120)),
});
