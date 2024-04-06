import {
    createBrowserRouter,
    redirect,
    RouterProvider,
    useRouteError,
} from 'react-router-dom';
import { configsPageRoute } from '~pages/configs';
import { homePageRoute } from '~pages/home';
import { GenericLayout, GuestLayout, NakedLayout } from '~pages/layouts';
import { loginPageRoute } from '~pages/login';
import { page404Route } from '~pages/page-404';
import {
    scenarioAddPageRoute,
    scenariosPageRoute,
    scenariosViewPageRoute,
} from '~pages/scenarios';
import { settingsPageRoute } from '~pages/settings';
import { switchersPageRoute } from '~pages/switchers';
import { titleCreatePageRoute, titlesViewPageRoute } from '~pages/titles';
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
                children: [
                    homePageRoute,
                    configsPageRoute,
                    scenariosPageRoute,
                    scenariosViewPageRoute,
                    scenarioAddPageRoute,
                    settingsPageRoute,
                    switchersPageRoute,
                    titleCreatePageRoute,
                    titlesViewPageRoute,
                ],
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
