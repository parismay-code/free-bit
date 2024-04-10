import { z } from 'zod';

export const IngredientSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    count: z.number(),
    cost: z.optional(z.number()),
    storage: z.optional(z.number()),
});

export const IngredientDtoSchema = z.object({
    name: z.string().max(28),
    description: z.optional(z.string().max(120)),
    cost: z.number(),
    storage: z.optional(z.number()),
});
