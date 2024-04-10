import { z } from 'zod';
import { UserDtoSchema, UserSchema } from './contracts';

export type User = z.infer<typeof UserSchema>;

export type UserDto = z.infer<typeof UserDtoSchema>;
