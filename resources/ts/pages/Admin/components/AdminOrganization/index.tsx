import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import useNotify from '@hooks/useNotify';

import { NotifyTypes } from '@interfaces/models/INotify';

import OrganizationsApiService from '@services/api/organizations/OrganizationsApiService';

const organizationsService = new OrganizationsApiService();

function AdminOrganization() {
    const { id } = useParams();

    const notify = useNotify();
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ['organization', id],
        queryFn: () => organizationsService.get(Number(id)),
        onSuccess: (organization) => {
            if (!organization) {
                notify('Организация не найдена', NotifyTypes.WARNING);
                navigate('/admin/organizations');
            }
        },
        staleTime: 120 * 60 * 1000,
        cacheTime: 120 * 60 * 1000,
        keepPreviousData: true,
        retry: false,
    });

    return data && <div className="admin-organization">{data.name}</div>;
}

export default AdminOrganization;
