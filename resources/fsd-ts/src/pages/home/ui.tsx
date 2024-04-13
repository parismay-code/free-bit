import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { orderQueries, orderTypes } from '~entities/order';
import { organizationQueries, organizationTypes } from '~entities/organization';
import { sessionQueries } from '~entities/session';

export function HomePage() {
    const [currentOrder, setCurrentOrder] = useState<orderTypes.Order>();
    const [organization, setOrganization] =
        useState<organizationTypes.Organization>();

    const { data: user } = useSuspenseQuery(
        sessionQueries.sessionService.queryOptions(),
    );

    if (user) {
        orderQueries.userCurrentOrderService
            .ensureQueryData(user.id)
            .then((order) => setCurrentOrder(order));

        if (user.organization_id) {
            organizationQueries.organizationService
                .ensureQueryData(user.organization_id)
                .then((organization) => setOrganization(organization));
        }
    }

    console.log(currentOrder);
    console.log(organization);

    return (
        <div className="home-page">
            Home Page | Nickname: {user?.name || 'Login first'}
        </div>
    );
}
