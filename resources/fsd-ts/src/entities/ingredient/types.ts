import { z } from 'zod';
import { IngredientDtoSchema, IngredientSchema } from './contracts';

export type Ingredient = z.infer<typeof IngredientSchema>;

export type IngredientDto = z.infer<typeof IngredientDtoSchema>;
