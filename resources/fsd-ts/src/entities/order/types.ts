import { z } from 'zod';
import {
    LoginUserDtoSchema,
    RegisterUserDtoSchema,
    UserDtoSchema,
    UserSchema,
} from './contracts';

export type UserDto = z.infer<typeof UserDtoSchema>;
export type LoginUserDto = z.infer<typeof LoginUserDtoSchema>;
export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>;

export type User = z.infer<typeof UserSchema>;
