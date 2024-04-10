import { z, ZodType } from 'zod';

export const CollectionSchema = <T extends ZodType>(data: T) =>
    z.object({
        data: z.array(data),
    });

export const PaginatedSchema = <T extends ZodType>(data: T) =>
    z.object({
        data: z.array(data),
        links: z.object({
            next: z.string().nullable(),
            prev: z.string().nullable(),
        }),
        meta: z.object({
            current_page: z.number(),
            last_page: z.number(),
            per_page: z.number(),
            total: z.number(),
        }),
    });
