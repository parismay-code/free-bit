import { z } from 'zod';

export const LoginUserDtoSchema = z.object({
    uid: z.string().max(4),
    password: z.string().min(8),
});

export const RegisterUserDtoSchema = z.object({
    name: z.string(),
    uid: z.string().max(4),
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
});
