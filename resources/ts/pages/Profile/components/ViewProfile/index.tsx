import { useOutletContext } from 'react-router-dom';

import calculateShifts, { type Days } from '@utils/calculateShifts';
import formatDate from '@utils/formatDate';
import monday from '@utils/monday';

import type { LayoutContext } from '@components/ProtectedLayout';

import './viewProfile.scss';

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

function ViewProfile() {
    const { user } = useOutletContext<LayoutContext>();

    return (
        <div className="profile-view">
            <div className="profile-view__group">
                <h3>Роли</h3>

                <div className="profile-view__group">
                    <h4>Глобальные</h4>

                    <div className="profile-view-roles">
                        {user.roles.data
                            .slice()
                            .sort((roleA, roleB) => roleA.id - roleB.id)
                            .map((role) => {
                                return (
                                    <div
                                        className="profile-view-roles__role"
                                        key={role.id}
                                    >
                                        {role.description}
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {user.organization.data && (
                    <div className="profile-view__group">
                        <h4>{user.organization.data.name}</h4>

                        <div className="profile-view-roles">
                            {user.organization.roles.data
                                .slice()
                                .sort(
                                    (roleA, roleB) =>
                                        roleB.priority - roleA.priority,
                                )
                                .map((role) => {
                                    return (
                                        <div
                                            className="profile-view-roles__role"
                                            key={role.id}
                                        >
                                            {role.description}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>

            <div className="profile-view__group">
                <h3>Основная информация</h3>

                <div className="profile-view__horizontal">
                    <div className="profile-view-avatar">
                        <div className="profile-view-avatar__content">
                            {user.avatar ? (
                                <img
                                    className="profile-view-avatar__image"
                                    src={user.avatar}
                                    alt=""
                                />
                            ) : (
                                <div className="profile-view-avatar__placeholder" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {user.organization && user.organization.data && (
                <div className="profile-view__group">
                    <h3>Организация</h3>

                    <div className="profile-view__horizontal">
                        <div className="profile-view-avatar">
                            <div className="profile-view-avatar__content">
                                {user.organization.data.avatar ? (
                                    <img
                                        className="profile-view-avatar__image"
                                        src={user.organization.data.avatar}
                                        alt=""
                                    />
                                ) : (
                                    <div className="profile-view-avatar__placeholder" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-view__group">
                        <h4>Смены</h4>

                        <div className="profile-view-shifts">
                            {Object.entries(
                                calculateShifts(user.organization.shifts.data),
                            ).map(([day, data]) => {
                                const hours = data.reduce((prev, sheet) => {
                                    return prev + sheet.hours;
                                }, 0);

                                const ended = data.every(
                                    (value) => !value.ended,
                                );

                                const titles = days[day as Days];

                                return (
                                    <div
                                        key={day}
                                        className="profile-view-shifts-day"
                                    >
                                        {!ended && (
                                            <div className="profile-view-shifts-day__online" />
                                        )}

                                        <span className="profile-view-shifts-day__title">
                                            {titles.title}
                                        </span>

                                        <span className="profile-view-shifts-day__hours">
                                            {hours ? `${hours} ч.` : 'Пусто'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewProfile;
