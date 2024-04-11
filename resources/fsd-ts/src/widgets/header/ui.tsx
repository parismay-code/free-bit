import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';

export function Header() {
    const { data: user } = useSuspenseQuery(
        sessionQueries.sessionService.queryOptions(),
    );

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
        <header>
            <nav>
                <div>
                    {!isRootPath() && (
                        <button type="button" onClick={() => navigate(-1)}>
                            Назад
                        </button>
                    )}

                    <Link to={pathKeys.home()}>BIT</Link>
                </div>

                {user && (
                    <div>
                        <span>{user.name}</span>
                    </div>
                )}

                {user && (
                    <div>
                        <button type="button" onClick={() => deleteUser()}>
                            Выход
                        </button>
                    </div>
                )}

                {!user && (
                    <div>
                        <NavLink to={pathKeys.login()}>Вход</NavLink>
                        <NavLink to={pathKeys.registration()}>
                            Регистрация
                        </NavLink>
                    </div>
                )}
            </nav>
        </header>
    );
}
