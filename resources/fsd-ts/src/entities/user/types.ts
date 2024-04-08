import { z } from 'zod';
import { UpdateUserDtoSchema, UserSchema } from './contracts';

export type User = z.infer<typeof UserSchema>;

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
