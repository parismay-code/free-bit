import { z } from 'zod';
import { ingredientContracts } from '~entities/ingredient';
import { CollectionSchema } from '~shared/contracts';

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    ingredients: CollectionSchema(ingredientContracts.IngredientSchema),
    price: z.number(),
    count: z.number(),
});

export const ProductDtoSchema = z.object({
    name: z.string().max(28),
    description: z.optional(z.string().max(120)),
    price: z.number(),
});
