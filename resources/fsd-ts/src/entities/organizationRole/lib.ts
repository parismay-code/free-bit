import { OrganizationRole } from './types';

export function hasOrganizationRole(
    needle: string | Array<string>,
    organizationRoles: Array<OrganizationRole>,
    strict: boolean = true,
): boolean {
    if (Array.isArray(needle)) {
        const needleOrganizationRoles = organizationRoles.filter(
            (organizationRole) => needle.includes(organizationRole.name),
        );

        if (strict) {
            return needleOrganizationRoles.length === organizationRoles.length;
        }

        return needleOrganizationRoles.length > 0;
    }

    return organizationRoles.some(
        (organizationRole) => organizationRole.name === needle,
    );
}
