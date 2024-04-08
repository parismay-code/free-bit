import {
    createBrowserRouter,
    redirect,
    RouterProvider,
    useRouteError,
} from 'react-router-dom';
import { homePageRoute } from '~pages/home';
import { GenericLayout, GuestLayout, NakedLayout } from '~pages/layouts';
import { loginPageRoute } from '~pages/login';
import { page404Route } from '~pages/page-404';
import { pathKeys } from '~shared/lib/react-router';

function BubbleError() {
    const error = useRouteError();
    if (error) throw error;
    return null;
}

const router = createBrowserRouter([
    {
        errorElement: <BubbleError />,
        children: [
            {
                element: <GenericLayout />,
                children: [homePageRoute],
            },
            {
                element: <GuestLayout />,
                children: [
                    // guest routes
                    loginPageRoute,
                ],
            },
            {
                element: <NakedLayout />,
                children: [
                    // 404, etc routes
                    page404Route,
                ],
            },
            {
                loader: async () => redirect(pathKeys.page404()),
                path: '*',
            },
        ],
    },
]);

export function BrowserRouter() {
    return <RouterProvider router={router} />;
}
