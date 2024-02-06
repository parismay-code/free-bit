import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import usePopUp from '@hooks/usePopUp';

import RolesApiService from '@services/api/roles/RolesApiService';

import './adminRoles.scss';

const rolesService = new RolesApiService();

function AdminRoles() {
    const popUp = usePopUp();

    const { data } = useQuery({
        queryKey: ['roles'],
        queryFn: rolesService.getAll,
        cacheTime: 120 * 60 * 1000,
        staleTime: 120 * 60 * 1000,
        retry: false,
    });

    return (
        <div className="admin-roles">
            <button
                type="button"
                className="admin-roles__create"
                onClick={() => {
                    popUp('Создать роль', () => <div>123</div>);
                }}
            >
                +
            </button>

            <div className="admin-roles-list">
                {data &&
                    data.data.map((role) => {
                        return (
                            <Link
                                to={`/admin/roles/${role.id}`}
                                key={role.id}
                                className="admin-roles-list-role highlight-text"
                            >
                                {role.name}
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
}

export default AdminRoles;
