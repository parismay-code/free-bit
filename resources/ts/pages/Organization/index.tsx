import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import useNotify from '@hooks/useNotify';

import { NotifyTypes } from '@interfaces/models/INotify';

import OrganizationsApiService from '@services/api/organizations/OrganizationsApiService';

const organizationsService = new OrganizationsApiService();

function Organization() {
    const { id } = useParams();

    const navigate = useNavigate();

    const notify = useNotify();

    const { data } = useQuery({
        queryKey: ['organization', id],
        queryFn: () => organizationsService.get(Number(id)),
        onSuccess: (organization) => {
            if (!organization) {
                notify('Организация не найдена', NotifyTypes.WARNING);
                navigate('/');
            }
        },
        keepPreviousData: true,
        retry: false,
    });

    return data && <div className="organization">Organization Page</div>;
}

export default Organization;
