import { Outlet, type RouteObject } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import ProtectedLayout from '@components/ProtectedLayout';
import GlobalErrors from '@components/GlobalErrors';

import Auth from '@pages/Auth';
import Home from '@pages/Home';
import Profile from '@pages/Profile';
import Admin from '@pages/Admin';
import Organization from '@pages/Organization';

const routes: Array<RouteObject> = [
    {
        element: (
            <ErrorBoundary FallbackComponent={GlobalErrors}>
                <Outlet />
            </ErrorBoundary>
        ),
        children: [
            {
                path: '/auth',
                element: <Auth />,
            },
            {
                element: <ProtectedLayout />,
                children: [
                    {
                        path: '/',
                        element: <Home />,
                    },
                    {
                        path: '/profile',
                        element: <Profile />,
                    },
                    {
                        path: '/admin',
                        element: <Admin />,
                    },
                    {
                        path: '/organization/:id',
                        element: <Organization />,
                    },
                ],
            },
            {
                path: '*',
                element: <div>404</div>,
            },
        ],
    },
];

export default routes;
