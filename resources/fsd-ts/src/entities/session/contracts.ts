import { z } from 'zod';

export const LoginUserDtoSchema = z.object({
    uid: z.string(),
    password: z.string(),
});

export const RegisterUserDtoSchema = z.object({
    name: z.string().max(28, 'Максимальная длина имени - 28 символов'),
    uid: z.string().max(6, 'Максимальная длина рег. данных - 6 символов'),
    email: z.string(),
    phone: z.string(),
    password: z.string().min(8, 'Минимальная длина пароля - 8 символов'),
    password_confirmation: z
        .string()
        .min(8, 'Минимальная длина пароля - 8 символов'),
});
