import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import AuthApiService from '@services/api/auth/AuthApiService';

import { setUser } from '@stores/authReducer';
import { useSelector } from '@stores/rootReducer';

const authService = new AuthApiService();

function ProtectedLayout() {
    const dispatch = useDispatch();

    const authStore = useSelector((state) => state.auth);

    const navigate = useNavigate();

    useQuery({
        queryKey: ['auth'],
        queryFn: authService.user,
        onSuccess: (user) => {
            dispatch(setUser(user));
        },
        staleTime: 120 * 60 * 1000,
        cacheTime: 120 * 60 * 1000,
        retry: false,
    });

    useEffect(() => {
        if (!authStore.user) {
            navigate(-1);
        }
    }, [navigate, authStore.user]);

    return <Outlet />;
}

export default ProtectedLayout;
