import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import cn from 'classnames';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { organizationQueries, organizationTypes } from '~entities/organization';
import { sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import './styles.scss';

export function Header() {
    const [organization, setOrganization] =
        useState<organizationTypes.Organization>();

    const { data: user } = useSuspenseQuery(
        sessionQueries.sessionService.queryOptions(),
    );

    if (user?.organization_id) {
        organizationQueries.organizationService
            .ensureQueryData(user.organization_id)
            .then((result) => {
                setOrganization(
                    result as organizationTypes.Organization | undefined,
                );
            });
    }

    const { mutate: deleteUser } = sessionQueries.useLogoutMutation();

    const location = useLocation();
    const navigate = useNavigate();

    const isRootPath = () => {
        const rootPaths = [
            pathKeys.root,
            pathKeys.home(),
            pathKeys.login(),
            pathKeys.registration(),
        ];

        return rootPaths.includes(location.pathname);
    };

    return (
        <header className="header">
            <nav className="header-nav">
                <div className="header-nav__group">
                    {!isRootPath() && (
                        <button type="button" onClick={() => navigate(-1)}>
                            Назад
                        </button>
                    )}

                    <Link to={pathKeys.home()} className="header__logo">
                        BIT
                    </Link>
                </div>

                {user && (
                    <div className="header-nav__group">
                        <span>{user.name}</span>
                        <span>{organization?.name || 'Без организации'}</span>
                    </div>
                )}

                {user && (
                    <div className="header-nav__group">
                        <button type="button" onClick={() => deleteUser()}>
                            Выход
                        </button>
                    </div>
                )}

                {!user && (
                    <div className="header-nav__group">
                        <NavLink
                            to={pathKeys.login()}
                            className={({ isActive }) =>
                                cn(
                                    'header__link',
                                    isActive && 'header__link_active',
                                )
                            }
                        >
                            Вход
                        </NavLink>

                        <NavLink
                            to={pathKeys.registration()}
                            className={({ isActive }) =>
                                cn(
                                    'header__link',
                                    isActive && 'header__link_active',
                                )
                            }
                        >
                            Регистрация
                        </NavLink>
                    </div>
                )}
            </nav>
        </header>
    );
}
