import { z } from 'zod';

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    uid: z.string(),
    email: z.string(),
    phone: z.string(),
    avatar: z.string(),
});

export const UserDtoSchema = z.object({
    user: UserSchema,
});

export const LoginUserDtoSchema = z.object({
    login: z.string().min(3),
    password: z.string().min(8),
});

export const RegisterUserDtoSchema = z.object({
    login: z.string().min(3),
    password: z.string().min(8),
});
