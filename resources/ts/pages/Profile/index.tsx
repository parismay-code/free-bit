import {
    NavLink,
    Outlet,
    useNavigate,
    useOutletContext,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import cn from 'classnames';

import useNotify from '@hooks/useNotify';
import useHeaderTitle from '@hooks/useHeaderTitle';

import { NotifyTypes } from '@interfaces/models/INotify';

import type { LayoutContext } from '@components/ProtectedLayout';

import AuthApiService from '@services/api/auth/AuthApiService';

import { setUser } from '@stores/authReducer';

import './profile.scss';

const authService = new AuthApiService();

function Profile() {
    const { user, setHeaderTitle } = useOutletContext<LayoutContext>();

    const dispatch = useDispatch();
    const notify = useNotify();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await authService.logout();

        if (result) {
            dispatch(setUser(false));
            navigate('/auth');
            notify('Вы вышли из аккаунта', NotifyTypes.INFO);
        }
    };

    useHeaderTitle(user.name);

    return (
        <div className="profile container">
            <button
                className="profile__logout"
                type="button"
                onClick={handleLogout}
            >
                Выйти
            </button>

            <nav className="profile-nav">
                <NavLink
                    to="/profile/view"
                    className={({ isActive }) =>
                        cn(
                            'profile-nav__link',
                            'highlight-text',
                            isActive && 'profile-nav__link_active',
                        )
                    }
                >
                    Профиль
                </NavLink>

                {user.organization && user.organization.data && (
                    <NavLink
                        to="/profile/organization"
                        className={({ isActive }) =>
                            cn(
                                'profile-nav__link',
                                'highlight-text',
                                isActive && 'profile-nav__link_active',
                            )
                        }
                    >
                        {user.organization.data.name}
                    </NavLink>
                )}

                <NavLink
                    to="/profile/orders"
                    className={({ isActive }) =>
                        cn(
                            'profile-nav__link',
                            'highlight-text',
                            isActive && 'profile-nav__link_active',
                        )
                    }
                >
                    Мои заказы
                </NavLink>

                <NavLink
                    to="/profile/edit"
                    className={({ isActive }) =>
                        cn(
                            'profile-nav__link',
                            'highlight-text',
                            isActive && 'profile-nav__link_active',
                        )
                    }
                >
                    Редактирование
                </NavLink>
            </nav>

            <div className="profile__content">
                <Outlet
                    context={{ user, setHeaderTitle } satisfies LayoutContext}
                />
            </div>
        </div>
    );
}

export default Profile;
