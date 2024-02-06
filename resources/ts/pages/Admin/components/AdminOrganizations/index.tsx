import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import usePopUp from '@hooks/usePopUp';

import OrganizationsApiService from '@services/api/organizations/OrganizationsApiService';

import './adminOrganizations.scss';

const organizationsService = new OrganizationsApiService();

function AdminOrganizations() {
    const popUp = usePopUp();

    const { data } = useQuery({
        queryKey: ['organizations'],
        queryFn: organizationsService.getAll,
        cacheTime: 120 * 60 * 1000,
        staleTime: 120 * 60 * 1000,
        retry: false,
    });

    return (
        <div className="admin-organizations">
            <button
                type="button"
                className="admin-organizations__create"
                onClick={() => {
                    popUp('Создать организацию', () => <div>123</div>);
                }}
            >
                +
            </button>

            <div className="admin-organizations-list">
                {data &&
                    data.data.map((organization) => {
                        return (
                            <Link
                                to={`/admin/organizations/${organization.id}`}
                                key={organization.id}
                                className="admin-organizations-list-organization highlight-text"
                            >
                                {organization.name}
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
}

export default AdminOrganizations;
