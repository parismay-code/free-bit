import { roleTypes } from '~entities/role';
import { User } from './types';

export function mapUser(user: User): User {
    return user;
}

export function mapUsers(users: Array<User>): Array<User> {
    return users;
}

export function hasRole(
    needle: string | Array<string>,
    roles: Array<roleTypes.Role>,
    strict: boolean = true,
): boolean {
    if (typeof needle === 'object') {
        const needleRoles = roles.filter((role) => needle.includes(role.name));

        if (strict) {
            return needleRoles.length === roles.length;
        }

        return needleRoles.length > 0;
    }

    return roles.some((role) => role.name === needle);
}
