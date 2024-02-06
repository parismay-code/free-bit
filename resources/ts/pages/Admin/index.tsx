import { useEffect } from 'react';
import {
    NavLink,
    Outlet,
    useNavigate,
    useOutletContext,
} from 'react-router-dom';
import cn from 'classnames';

import useNotify from '@hooks/useNotify';
import useHeaderTitle from '@hooks/useHeaderTitle';
import { useSelector } from '@stores/rootReducer';

import type { LayoutContext } from '@components/ProtectedLayout';
import { NotifyTypes } from '@interfaces/models/INotify';

import checkRole from '@utils/checkRole';

import roles from '@configs/roles';

import './admin.scss';

const accessRoles = roles.app.admin.concat(roles.app.manager);

function Admin() {
    const authStore = useSelector((state) => state.auth);

    const { user, setHeaderTitle } = useOutletContext<LayoutContext>();

    const isAdmin = checkRole(authStore.user, false, ...accessRoles);

    const navigate = useNavigate();

    const notify = useNotify();

    useEffect(() => {
        if (!isAdmin) {
            notify('Недостаточно прав', NotifyTypes.ERROR);
            navigate('/');
        }
    }, [isAdmin, navigate, notify]);

    useHeaderTitle('Административная панель');

    return (
        isAdmin && (
            <div className="admin container">
                <nav className="admin-nav">
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            cn(
                                'admin-nav__link',
                                'highlight-text',
                                isActive && 'admin-nav__link_active',
                            )
                        }
                    >
                        Пользователи
                    </NavLink>

                    <NavLink
                        to="/admin/organizations"
                        className={({ isActive }) =>
                            cn(
                                'admin-nav__link',
                                'highlight-text',
                                isActive && 'admin-nav__link_active',
                            )
                        }
                    >
                        Организации
                    </NavLink>

                    <NavLink
                        to="/admin/roles"
                        className={({ isActive }) =>
                            cn(
                                'admin-nav__link',
                                'highlight-text',
                                isActive && 'admin-nav__link_active',
                            )
                        }
                    >
                        Роли
                    </NavLink>
                </nav>

                <div className="profile__content">
                    <Outlet
                        context={
                            { user, setHeaderTitle } satisfies LayoutContext
                        }
                    />
                </div>
            </div>
        )
    );
}

export default Admin;
