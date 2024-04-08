import { z } from 'zod';

export const OrderSchema = z.object({
    id: z.number(),
    name: z.string(),
    uid: z.string(),
    email: z.string(),
    phone: z.string(),
    avatar: z.string(),
});
