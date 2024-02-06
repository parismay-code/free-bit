import { Navigate, Outlet, type RouteObject } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import ProtectedLayout from '@components/ProtectedLayout';
import GlobalErrors from '@components/GlobalErrors';

import Auth from '@pages/Auth';
import Home from '@pages/Home';
import Admin from '@pages/Admin';
import AdminUsers from '@pages/Admin/components/AdminUsers';
import AdminOrganizations from '@pages/Admin/components/AdminOrganizations';
import AdminRoles from '@pages/Admin/components/AdminRoles';
import AdminUser from '@pages/Admin/components/AdminUser';
import AdminOrganization from '@pages/Admin/components/AdminOrganization';
import AdminRole from '@pages/Admin/components/AdminRole';
import Organization from '@pages/Organization';
import Profile from '@pages/Profile';
import EditProfile from '@pages/Profile/components/EditProfile';
import ViewProfile from '@pages/Profile/components/ViewProfile';
import ViewOrganization from '@pages/Profile/components/ViewOrganization';
import ViewOrders from '@pages/Profile/components/ViewOrders';

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
                        path: '/organization/:id',
                        element: <Organization />,
                    },
                    {
                        path: '/admin',
                        element: <Admin />,
                        children: [
                            {
                                path: '/admin/users',
                                element: <AdminUsers />,
                            },
                            {
                                path: '/admin/users/:id',
                                element: <AdminUser />,
                            },
                            {
                                path: '/admin/organizations',
                                element: <AdminOrganizations />,
                            },
                            {
                                path: '/admin/organizations/:id',
                                element: <AdminOrganization />,
                            },
                            {
                                path: '/admin/roles',
                                element: <AdminRoles />,
                            },
                            {
                                path: '/admin/roles/:id',
                                element: <AdminRole />,
                            },
                        ],
                    },
                    {
                        element: <Profile />,
                        children: [
                            {
                                path: '/profile/view',
                                element: <ViewProfile />,
                            },
                            {
                                path: '/profile/organization',
                                element: <ViewOrganization />,
                            },
                            {
                                path: '/profile/orders',
                                element: <ViewOrders />,
                            },
                            {
                                path: '/profile/edit',
                                element: <EditProfile />,
                            },
                        ],
                    },
                ],
            },
            {
                path: '*',
                element: <Navigate to="/" />,
            },
        ],
    },
];

export default routes;
