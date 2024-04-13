import { useSuspenseQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom';
import { sessionQueries } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { Header } from '~widgets/header';
import { Notify } from '~widgets/notify';
import { PopUp } from '~widgets/pop-up';

function Layout() {
    return (
        <>
            <Header />
            <div className="container">
                <Outlet />
            </div>
            <PopUp />
            <Notify />
        </>
    );
}

export function GenericLayout() {
    const { data: user } = useSuspenseQuery(
        sessionQueries.sessionService.queryOptions(),
    );

    if (!user) {
        return <Navigate to={pathKeys.login()} />;
    }

    return <Layout />;
}

export function GuestLayout() {
    const { data: user } = useSuspenseQuery(
        sessionQueries.sessionService.queryOptions(),
    );

    if (user) {
        return <Navigate to={pathKeys.home()} />;
    }

    return <Layout />;
}

export function NakedLayout() {
    return <Outlet />;
}
