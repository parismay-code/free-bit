import { z } from 'zod';

export const LoginUserDtoSchema = z.object({
    uid: z.string(),
    password: z.string(),
});

export const RegisterUserDtoSchema = z.object({
    name: z.string().max(28),
    uid: z.string().max(6),
    email: z.string(),
    phone: z.string(),
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
});
