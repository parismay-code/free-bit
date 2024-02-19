import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import usePopUp from '@hooks/usePopUp';

import OrganizationsApiService from '@services/api/organizations/OrganizationsApiService';

import GInput from '@components/GInput';
import CreateOrganizationPopUp from '@components/PopUp/components/CreateOrganizationPopUp';

import './adminOrganizations.scss';

const organizationsService = new OrganizationsApiService();

function AdminOrganizations() {
    const [query, setQuery] = useState<string>();
    const [page, setPage] = useState<number>(1);

    const queryTimeout = useRef<number>();

    const { data } = useQuery({
        queryKey: ['organizations', page, query],
        queryFn: () => organizationsService.getAll(page, query),
        cacheTime: 120 * 60 * 1000,
        staleTime: 120 * 60 * 1000,
        retry: false,
    });

    const handleQuery = (value: string) => {
        if (queryTimeout.current) {
            clearTimeout(queryTimeout.current);
        }

        queryTimeout.current = setTimeout(() => {
            setQuery(value);
        }, 1000);
    };

    const popUp = usePopUp();

    return (
        <div className="admin-organizations">
            <div className="admin-users__query admin-organizations__query">
                <GInput
                    type="text"
                    title="Поиск"
                    hint="Название организации"
                    handleInput={handleQuery}
                />

                <button
                    type="button"
                    className="admin-organizations__create highlight-background highlight-text"
                    onClick={() => {
                        popUp.open(
                            'Создать организацию',
                            <CreateOrganizationPopUp />,
                        );
                    }}
                >
                    +
                </button>
            </div>

            <div className="admin-organizations-list">
                {data &&
                    data.data.map((organization) => {
                        return (
                            <Link
                                to={`/admin/organizations/${organization.id}`}
                                key={organization.id}
                                className="admin-organizations-list-organization highlight-background highlight-text"
                            >
                                <div className="admin-organizations-list-organization-avatar">
                                    <div className="admin-organizations-list-organization-avatar__content">
                                        {organization.avatar ? (
                                            <img
                                                className="admin-organizations-list-organization-avatar__image"
                                                src={organization.avatar}
                                                alt=""
                                            />
                                        ) : (
                                            <div className="admin-organizations-list-organization-avatar__placeholder" />
                                        )}
                                    </div>
                                </div>

                                <div className="admin-organizations-list-organization__group">
                                    <span className="admin-organizations-list-organization__name">
                                        {organization.name}
                                    </span>

                                    <span className="admin-organizations-list-organization__owner">
                                        {organization.owner.name}
                                    </span>
                                </div>

                                <span className="admin-organizations-list-organization__id">
                                    {organization.id}
                                </span>

                                <span className="admin-organizations-list-organization__employees">
                                    Работников: {organization.employees_count}
                                </span>
                            </Link>
                        );
                    })}
            </div>

            {data && data.meta.total > data.meta.per_page && (
                <div className="admin-users-paginator">
                    <button
                        type="button"
                        className="admin-users-paginator__button admin-users-paginator__button_prev"
                        onClick={() => {
                            if (page === 1) {
                                return;
                            }

                            setPage((prev) => prev - 1);
                        }}
                    >
                        Назад
                    </button>

                    <div className="admin-users-paginator__page">
                        {data.meta.current_page}/{data.meta.last_page}
                    </div>

                    <button
                        type="button"
                        className="admin-users-paginator__button admin-users-paginator__button_next"
                        onClick={() => {
                            if (page === data.meta.last_page) {
                                return;
                            }

                            setPage((prev) => prev + 1);
                        }}
                    >
                        Далее
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminOrganizations;
