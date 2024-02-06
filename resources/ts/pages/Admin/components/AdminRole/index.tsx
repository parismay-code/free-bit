import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import useNotify from '@hooks/useNotify';

import { NotifyTypes } from '@interfaces/models/INotify';

import RolesApiService from '@services/api/roles/RolesApiService';

const rolesService = new RolesApiService();

function AdminOrganizations() {
    const { id } = useParams();

    const notify = useNotify();
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ['role', id],
        queryFn: () => rolesService.get(Number(id)),
        onSuccess: (organization) => {
            if (!organization) {
                notify('Роль не найдена', NotifyTypes.WARNING);
                navigate('/admin/roles');
            }
        },
        keepPreviousData: true,
        retry: false,
    });

    return data && <div className="admin-role">{data.name}</div>;
}

export default AdminOrganizations;
