import { useSuspenseQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom';
import { sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { Header } from '~widgets/header';

export function GenericLayout() {
    const { data: user } = useSuspenseQuery(
        sessionQueries.userService.queryOptions(),
    );

    if (!user) {
        return <Navigate to={pathKeys.login()} />;
    }

    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export function GuestLayout() {
    const { data: user } = useSuspenseQuery(
        sessionQueries.userService.queryOptions(),
    );

    if (user) {
        return <Navigate to={pathKeys.home()} />;
    }

    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export function NakedLayout() {
    return <Outlet />;
}
