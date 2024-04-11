import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { LoginPage } from './ui';

export const loginPageRoute: RouteObject = {
    path: pathKeys.login(),
    element: createElement(LoginPage),
    loader: async (args) => {
        if (await sessionQueries.sessionService.ensureQueryData()) {
            return redirect(pathKeys.home());
        }

        await sessionQueries.sessionService.prefetchQuery();
        return args;
    },
};
