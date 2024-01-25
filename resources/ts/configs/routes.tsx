import { Outlet, type RouteObject } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import ProtectedLayout from '@components/ProtectedLayout';
import GlobalErrors from '@components/GlobalErrors';

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
                element: <div>Auth</div>,
            },
            {
                element: <ProtectedLayout />,
                children: [
                    {
                        path: '/',
                        element: <div>Home Page</div>,
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
