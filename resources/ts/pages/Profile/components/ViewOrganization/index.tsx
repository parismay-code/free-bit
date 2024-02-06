import { useOutletContext } from 'react-router-dom';
import cn from 'classnames';

import type IOrganization from '@interfaces/models/IOrganization';
import type { LayoutContext } from '@components/ProtectedLayout';

import calculateShifts, { type Days } from '@utils/calculateShifts';
import formatDate from '@utils/formatDate';
import monday from '@utils/monday';

import './viewOrganization.scss';

interface IDay {
    title: string;
    date: string;
}

const days: Record<Days, IDay> = {
    sun: {
        title: 'Воскресенье',
        date: formatDate(new Date(monday().setDate(monday().getDate() + 6))),
    },
    mon: {
        title: 'Понедельник',
        date: formatDate(monday()),
    },
    tue: {
        title: 'Вторник',
        date: formatDate(new Date(monday().setDate(monday().getDate() + 1))),
    },
    wed: {
        title: 'Среда',
        date: formatDate(new Date(monday().setDate(monday().getDate() + 2))),
    },
    thu: {
        title: 'Четверг',
        date: formatDate(new Date(monday().setDate(monday().getDate() + 3))),
    },
    fri: {
        title: 'Пятница',
        date: formatDate(new Date(monday().setDate(monday().getDate() + 4))),
    },
    sat: {
        title: 'Суббота',
        date: formatDate(new Date(monday().setDate(monday().getDate() + 5))),
    },
};

function ViewOrganization() {
    const { user } = useOutletContext<LayoutContext>();

    const organization = user.organization.data as IOrganization;

    return (
        <div className="organization-view">
            <div className="organization-view__group">
                <h3>Роли</h3>

                <div className="organization-view-roles">
                    {user.organization.roles.data
                        .slice()
                        .sort((roleA, roleB) => roleB.priority - roleA.priority)
                        .map((role) => {
                            return (
                                <div
                                    className="organization-view-roles__role"
                                    key={role.id}
                                >
                                    {role.description}
                                </div>
                            );
                        })}
                </div>
            </div>

            <div className="organization-view__group">
                <h3>Основная информация</h3>

                <div className="organization-view__horizontal">
                    <div className="organization-view-avatar">
                        <div className="organization-view-avatar__content">
                            {organization.avatar ? (
                                <img
                                    className="organization-view-avatar__image"
                                    src={organization.avatar}
                                    alt=""
                                />
                            ) : (
                                <div className="organization-view-avatar__placeholder" />
                            )}
                        </div>
                    </div>

                    <div className="organization-view-info">
                        <div className="organization-view-info__field">
                            <div className="organization-view-info__title">
                                Название
                            </div>

                            <span>{organization.name}</span>
                        </div>

                        <div className="organization-view-info__field">
                            <div className="organization-view-info__title">
                                Владелец
                            </div>

                            <span>
                                {organization.owner.id === user.id
                                    ? 'Вы'
                                    : organization.owner.name}
                            </span>
                        </div>

                        <div className="organization-view-info__field">
                            <div className="organization-view-info__title">
                                Работники
                            </div>

                            <span>{organization.employees_count}</span>
                        </div>

                        <div className="organization-view-info__field">
                            <div className="organization-view-info__title">
                                Описание
                            </div>

                            <span>{organization.description}</span>
                        </div>
                    </div>
                </div>

                <div className="organization-view__group">
                    <h4>Смены</h4>

                    <div className="organization-view-shifts">
                        {Object.entries(
                            calculateShifts(user.organization.shifts.data),
                        ).map(([day, data]) => {
                            const hours = data.reduce((prev, sheet) => {
                                return prev + sheet.hours;
                            }, 0);

                            const ended = data.every((value) => value.ended);

                            const titles = days[day as Days];

                            const nowDate = formatDate(new Date());

                            return (
                                <div
                                    key={day}
                                    className={cn(
                                        'organization-view-shifts-day',
                                        titles.date === nowDate &&
                                            'organization-view-shifts-day_active',
                                    )}
                                >
                                    {!ended && (
                                        <div className="organization-view-shifts-day__online" />
                                    )}

                                    <span className="organization-view-shifts-day__title">
                                        {titles.title}
                                    </span>

                                    <span className="organization-view-shifts-day__date">
                                        {titles.date}
                                    </span>

                                    <span className="organization-view-shifts-day__hours">
                                        {hours ? `${hours} ч.` : 'Пусто'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewOrganization;
