import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import cn from 'classnames';

import usePopUp from '@hooks/usePopUp';
import useNotify from '@hooks/useNotify';

import type { IFullUser } from '@interfaces/models/IUser';
import type IOrganizationRole from '@interfaces/models/IOrganizationRole';
import { NotifyTypes } from '@interfaces/models/INotify';

import RolesApiService from '@services/api/roles/RolesApiService';
import OrganizationRolesApiService from '@services/api/organizations/roles/OrganizationRolesApiService';

import './addRolePopUp.scss';

export interface AddRolePopUpProps {
    user: IFullUser;
    organization?: boolean;
}

const rolesService = new RolesApiService();
const organizationRolesService = new OrganizationRolesApiService();

function AddRolePopUp({ user, organization }: AddRolePopUpProps) {
    const [roleId, setRoleId] = useState<number>();

    const notify = useNotify();
    const { close } = usePopUp();

    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: [organization ? 'organizationRoles' : 'roles'],
        queryFn: () => {
            if (organization && user.organization.data?.id) {
                return organizationRolesService.getAll(
                    user.organization.data.id,
                );
            }

            return rolesService.getAll();
        },
        cacheTime: 120 * 60 * 1000,
        staleTime: 120 * 60 * 1000,
        retry: false,
    });

    const currentRoles = organization
        ? user.organization.roles.data
        : user.roles.data;

    const currentRolesIds = currentRoles.map((role) => role.id);

    return (
        data && (
            <div className="add-role-pop-up">
                <div className="add-role-pop-up-roles">
                    {data.data
                        .slice()
                        .filter((role) => !currentRolesIds.includes(role.id))
                        .sort((roleA, roleB) => {
                            if (organization) {
                                return (
                                    (roleB as IOrganizationRole).priority -
                                    (roleA as IOrganizationRole).priority
                                );
                            }

                            return roleA.id - roleB.id;
                        })
                        .map((role) => {
                            return (
                                <button
                                    type="button"
                                    key={role.id}
                                    className={cn(
                                        'add-role-pop-up-roles__role',
                                        roleId === role.id &&
                                            'add-role-pop-up-roles__role_active',
                                    )}
                                    onClick={() => {
                                        setRoleId(role.id);
                                    }}
                                >
                                    {role.description}
                                </button>
                            );
                        })}
                </div>

                <div className="pop-up-controls">
                    <button
                        type="button"
                        className="pop-up-controls__close"
                        onClick={async () => {
                            const organizationId = user.organization.data?.id;

                            if (organization && !organizationId) {
                                notify(
                                    'Невозможно назначить роль',
                                    NotifyTypes.ERROR,
                                );
                                return;
                            }

                            if (!roleId) {
                                notify('Роль не выбрана', NotifyTypes.WARNING);
                                return;
                            }

                            let status = false;

                            if (organization && organizationId) {
                                status = await organizationRolesService.attach(
                                    organizationId,
                                    user.id,
                                    roleId,
                                );
                            }

                            if (!organization) {
                                status = await rolesService.attach(
                                    user.id,
                                    roleId,
                                );
                            }

                            if (status) {
                                notify(
                                    'Роль успешно назначена',
                                    NotifyTypes.SUCCESS,
                                );

                                await queryClient.invalidateQueries([
                                    'user',
                                    user.id,
                                ]);
                            } else {
                                notify(
                                    'Что-то пошло не так...',
                                    NotifyTypes.ERROR,
                                );
                            }

                            close();
                        }}
                        disabled={!roleId}
                    >
                        Добавить
                    </button>
                </div>
            </div>
        )
    );
}

AddRolePopUp.defaultProps = {
    organization: false,
};

export default AddRolePopUp;
