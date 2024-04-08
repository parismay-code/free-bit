import { z } from 'zod';
import { LoginUserDtoSchema, RegisterUserDtoSchema } from './contracts';

export type LoginUserDto = z.infer<typeof LoginUserDtoSchema>;
export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>;
