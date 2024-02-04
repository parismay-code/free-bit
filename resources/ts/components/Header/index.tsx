import { Link, NavLink } from 'react-router-dom';
import cn from 'classnames';

import logo from '@assets/logo.svg';

import { useSelector } from '@stores/rootReducer';

import checkRole from '@utils/checkRole';

import './header.scss';

interface HeaderProps {
    title?: string;
}

function Header({ title }: HeaderProps) {
    const authStore = useSelector((state) => state.auth);

    const isAdmin =
        authStore.user &&
        checkRole(authStore.user, false, 'developer', 'admin', 'manager');

    return (
        <header className="header">
            <nav className="header-nav container">
                <div className="header-nav__group">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            cn(
                                'header-nav__link',
                                isActive && 'header-nav__link_active',
                            )
                        }
                    >
                        <img className="header__logo" src={logo} alt="BIT" />
                    </NavLink>

                    <h2 className="header__title">
                        {title ? `BIT / ${title}` : 'BIT'}
                    </h2>
                </div>

                <div className="header-nav__group">
                    {isAdmin && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                cn(
                                    'header-nav__link',
                                    isActive && 'header-nav__link_active',
                                )
                            }
                        >
                            Администрирование
                        </NavLink>
                    )}

                    {authStore.user && (
                        <Link to="/profile" className="header-nav__link">
                            <div className="header-profile">
                                <div className="header-profile__content">
                                    {authStore.user.avatar ? (
                                        <img
                                            className="header-profile__avatar"
                                            src={authStore.user.avatar}
                                            alt={authStore.user.uid}
                                        />
                                    ) : (
                                        <div className="header-profile__placeholder" />
                                    )}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}

Header.defaultProps = {
    title: undefined,
};

export default Header;
