import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import type { IFullUser } from '@interfaces/models/IUser';

import AuthApiService from '@services/api/auth/AuthApiService';

import { setUser } from '@stores/authReducer';
import { useSelector } from '@stores/rootReducer';

import Header from '@components/Header';
import PopUp from '@components/PopUp';
import Notify from '@components/Notify';

const authService = new AuthApiService();

export type LayoutContext = {
    setHeaderTitle: Dispatch<SetStateAction<string | undefined>>;
    user: IFullUser;
};

function ProtectedLayout() {
    const [headerTitle, setHeaderTitle] = useState<string>();

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
            navigate('/auth');
        }
    }, [navigate, authStore.user]);

    return (
        <div className="layout">
            <Header title={headerTitle} />
            <main className="layout__main">
                <Outlet
                    context={
                        {
                            setHeaderTitle,
                            user: authStore.user as IFullUser,
                        } satisfies LayoutContext
                    }
                />

                <PopUp />
                <Notify />
            </main>
        </div>
    );
}

export default ProtectedLayout;
