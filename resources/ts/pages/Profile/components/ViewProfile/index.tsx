import { useOutletContext } from 'react-router-dom';

import type { LayoutContext } from '@components/ProtectedLayout';

import './viewProfile.scss';

function ViewProfile() {
    const { user } = useOutletContext<LayoutContext>();

    return (
        <div className="profile-view">
            <div className="profile-view__group">
                <h3>Роли</h3>

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

                    <div className="profile-view-info">
                        <div className="profile-view-info__field">
                            <div className="profile-view-info__title">Имя</div>

                            <span>{user.name}</span>
                        </div>

                        <div className="profile-view-info__field">
                            <div className="profile-view-info__title">
                                Рег. данные
                            </div>

                            <span>{user.uid}</span>
                        </div>

                        <div className="profile-view-info__field">
                            <div className="profile-view-info__title">
                                Почта
                            </div>

                            <span>{user.email}</span>
                        </div>

                        <div className="profile-view-info__field">
                            <div className="profile-view-info__title">
                                Телефон
                            </div>

                            <span>{user.phone}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProfile;
