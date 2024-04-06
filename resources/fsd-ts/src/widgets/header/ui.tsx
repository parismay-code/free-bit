import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';

export function Header() {
    const { data: user } = useSuspenseQuery(
        sessionQueries.userService.queryOptions(),
    );

    const { mutate: deleteUser } = sessionQueries.useLogoutMutation();

    const location = useLocation();
    const navigate = useNavigate();

    const isRootPath = () => {
        const rootPaths = [pathKeys.root, pathKeys.home()];

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

                    <Link to={pathKeys.home()}>Scoring Testing</Link>
                </div>

                {user && (
                    <div>
                        <span>{user.login}</span>
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
                        <NavLink to={pathKeys.root}>Вход</NavLink>
                    </div>
                )}
            </nav>
        </header>
    );
}
