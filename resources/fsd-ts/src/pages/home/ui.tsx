import { useSuspenseQuery } from '@tanstack/react-query';
import { sessionQueries } from '~entities/session';

export function HomePage() {
    const { data: user } = useSuspenseQuery(
        sessionQueries.userService.queryOptions(),
    );

    return (
        <div className="home-page">
            Home Page | Nickname: {user?.login || 'Login first'}
        </div>
    );
}
