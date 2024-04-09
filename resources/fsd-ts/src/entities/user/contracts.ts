import { z } from 'zod';
import { orderContracts } from '~entities/order';
import { organizationContracts } from '~entities/organization';
import { roleContracts } from '~entities/role';

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    uid: z.string(),
    email: z.string().email(),
    phone: z.string(),
    avatar: z.string(),
    roles: z.object({
        data: z.array(roleContracts.RoleSchema),
    }),
    orders: z.optional(
        z.object({
            created: z.object({
                data: z.array(orderContracts.OrderSchema),
            }),
            handled: z.object({
                data: z.array(orderContracts.OrderSchema),
            }),
            delivered: z.object({
                data: z.array(orderContracts.OrderSchema),
            }),
        }),
    ),
    organization: z.optional(
        z.object({
            data: organizationContracts.OrganizationSchema,
            roles: z.object({
                data: z.array(z.any()),
            }),
            shifts: z
                .object({
                    data: z.array(z.any()),
                })
                .nullable(),
        }),
    ),
    ownedOrganization: z
        .object({
            data: organizationContracts.OrganizationSchema,
        })
        .nullable(),
});

export const UpdateUserDtoSchema = z.object({
    name: z.string(),
    uid: z.string(),
    email: z.string().email(),
    phone: z.string(),
    avatar: z.string(),
    password: z.string().min(8),
    new_password: z.string().min(8),
    new_password_confirmation: z.string().min(8),
});
