import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { RegistrationPage } from './ui';

export const registrationPageRoute: RouteObject = {
    path: pathKeys.registration(),
    element: createElement(RegistrationPage),
    loader: async (args) => {
        if (await sessionQueries.sessionService.ensureQueryData()) {
            return redirect(pathKeys.home());
        }

        return args;
    },
};
