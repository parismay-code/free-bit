import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import OrganizationsApiService from '@services/api/organizations/OrganizationsApiService';

const organizationsService = new OrganizationsApiService();

function Home() {
    const { data } = useQuery({
        queryKey: ['organizations'],
        queryFn: organizationsService.getAll,
        cacheTime: 120 * 60 * 1000,
        staleTime: 120 * 60 * 1000,
        retry: false,
    });

    return (
        <div className="home container">
            {data &&
                data.data.map((organization) => {
                    return (
                        <Link
                            key={organization.id}
                            to={`/organization/${organization.id}`}
                        >
                            {organization.name}
                        </Link>
                    );
                })}
        </div>
    );
}

export default Home;
