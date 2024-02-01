import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useNotify from '@hooks/useNotify';
import { useSelector } from '@stores/rootReducer';

import { NotifyTypes } from '@interfaces/models/INotify';

import checkRole from '@utils/checkRole';

import roles from '@configs/roles';

const accessRoles = roles.app.admin.concat(roles.app.manager);

function Admin() {
    const authStore = useSelector((state) => state.auth);

    const isAdmin = checkRole(authStore.user, false, ...accessRoles);

    const navigate = useNavigate();

    const notify = useNotify();

    useEffect(() => {
        if (!isAdmin) {
            notify('Недостаточно прав', NotifyTypes.ERROR);
            navigate('/');
        }
    }, [isAdmin, navigate, notify]);

    return isAdmin && <div className="admin">Admin Page</div>;
}

export default Admin;
