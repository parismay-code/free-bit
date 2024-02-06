import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import UsersApiService from '@services/api/users/UsersApiService';

import './adminUsers.scss';

const usersService = new UsersApiService();

function AdminUsers() {
    const [page, setPage] = useState<number>(1);

    const { data } = useQuery({
        queryKey: ['users', page],
        queryFn: () => usersService.getAll(page),
        keepPreviousData: true,
        retry: false,
    });

    return (
        data && (
            <div className="admin-users">
                <div className="admin-users-list">
                    {data.data.map((user) => {
                        return (
                            <Link
                                to={`/admin/users/${user.id}`}
                                key={user.id}
                                className="admin-users-list-user highlight-text"
                            >
                                <div className="admin-users-list-user-avatar">
                                    <div className="admin-users-list-user-avatar__content">
                                        {user.avatar ? (
                                            <img
                                                className="admin-users-list-user-avatar__image"
                                                src={user.avatar}
                                                alt=""
                                            />
                                        ) : (
                                            <div className="admin-users-list-user-avatar__placeholder" />
                                        )}
                                    </div>
                                </div>

                                <span className="admin-users-list-user__id">
                                    {user.id}
                                </span>

                                <span className="admin-users-list-user__uid">
                                    {user.uid}
                                </span>

                                <span className="admin-users-list-user__name">
                                    {user.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

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
            </div>
        )
    );
}

export default AdminUsers;
