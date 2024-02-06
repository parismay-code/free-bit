import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import useNotify from '@hooks/useNotify';

import { NotifyTypes } from '@interfaces/models/INotify';

import UsersApiService from '@services/api/users/UsersApiService';

const usersService = new UsersApiService();

function AdminOrganizations() {
    const { id } = useParams();

    const notify = useNotify();
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ['user', id],
        queryFn: () => usersService.get(Number(id)),
        onSuccess: (organization) => {
            if (!organization) {
                notify('Пользователь не найден', NotifyTypes.WARNING);
                navigate('/admin/users');
            }
        },
        keepPreviousData: true,
        retry: false,
    });

    return data && <div className="admin-user">{data.name}</div>;
}

export default AdminOrganizations;
