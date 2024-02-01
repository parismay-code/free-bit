import type { IFullUser } from '@interfaces/models/IUser';
import type IRole from '@interfaces/models/IRole';
import type IOrganizationRole from '@interfaces/models/IOrganizationRole';

const checkRole = (
    user: IFullUser | false,
    organization: boolean,
    ...roleNames: Array<string>
): boolean => {
    if (!user) {
        return false;
    }

    let roles: Array<IRole | IOrganizationRole>;

    if (organization) {
        roles = user.organization.roles.data;
    } else {
        roles = user.roles.data;
    }

    if (roles.length === 0) {
        return false;
    }

    for (let i = 0; i < roleNames.length; i += 1) {
        const roleName = roleNames[i].replaceAll(' ', '');

        const idx = roles.findIndex((role) => role.name === roleName);

        if (idx >= 0) {
            return true;
        }
    }

    return false;
};

export default checkRole;
