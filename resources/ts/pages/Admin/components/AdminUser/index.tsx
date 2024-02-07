import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import cn from 'classnames';

import useNotify from '@hooks/useNotify';

import { NotifyTypes } from '@interfaces/models/INotify';
import type IOrganization from '@interfaces/models/IOrganization';

import UsersApiService from '@services/api/users/UsersApiService';
import RolesApiService from '@services/api/roles/RolesApiService';
import OrganizationRolesApiService from '@services/api/organizations/roles/OrganizationRolesApiService';
import EmployeesApiService from '@services/api/organizations/employees/EmployeesApiService';
import ApiError from '@services/api/ApiError';

import GInput from '@components/GInput';
import GButton from '@components/GButton';

import calculateShifts, { type Days } from '@utils/calculateShifts';
import formatDate from '@utils/formatDate';
import monday from '@utils/monday';

import './adminUser.scss';

interface IDay {
    title: string;
    date: string;
}

const usersService = new UsersApiService();
const rolesService = new RolesApiService();
const organizationRolesService = new OrganizationRolesApiService();
const employeesService = new EmployeesApiService();

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

type FormFields =
    | 'avatar'
    | 'name'
    | 'uid'
    | 'email'
    | 'phone'
    | 'password'
    | 'new_password'
    | 'new_password_confirmation';

function AdminUser() {
    const [errors, setErrors] =
        useState<Record<FormFields, Array<string> | undefined>>();
    const [preview, setPreview] = useState<string | null>(null);

    const { id } = useParams();

    const notify = useNotify();
    const navigate = useNavigate();

    const { data, refetch } = useQuery({
        queryKey: ['user', id],
        queryFn: () => usersService.get(Number(id)),
        onSuccess: (user) => {
            if (!user) {
                notify('Пользователь не найден', NotifyTypes.WARNING);
                navigate('/admin/users');

                return;
            }

            setPreview(user.avatar);
        },
        keepPreviousData: true,
        retry: false,
    });

    const form = useRef<HTMLFormElement>(null);
    const uid = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const newPassword = useRef<HTMLInputElement>(null);
    const newPasswordConfirmation = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (
            !data ||
            !form.current ||
            !uid.current ||
            !password.current ||
            !newPassword.current ||
            !newPasswordConfirmation.current
        ) {
            return;
        }

        const formData = new FormData(form.current);

        if (uid.current.value === data.uid) {
            formData.delete('uid');
        }

        if (!password.current.value) {
            formData.delete('password');
        }

        if (!newPassword.current.value) {
            formData.delete('new_password');
        }

        if (!newPasswordConfirmation.current.value) {
            formData.delete('new_password_confirmation');
        }

        const result = await usersService.update<FormFields>(data.id, formData);

        if (result instanceof ApiError) {
            if (result.data) {
                setErrors(result.data.errors);
            }

            return;
        }

        if (result) {
            setErrors(undefined);
            notify('Данные профиля успешно изменены', NotifyTypes.SUCCESS);

            newPassword.current.value = '';
            newPasswordConfirmation.current.value = '';

            await refetch();
        }
    };

    return (
        data && (
            <div className="admin-user">
                <form
                    ref={form}
                    className="profile-edit__form"
                    onSubmit={handleSubmit}
                >
                    <div className="profile-edit__group">
                        <h3>Роли</h3>

                        <div className="profile-view-roles">
                            {data.roles.data
                                .slice()
                                .sort((roleA, roleB) => roleA.id - roleB.id)
                                .map((role) => {
                                    return (
                                        <div
                                            className="profile-view-roles__role admin-user-role"
                                            key={role.id}
                                        >
                                            <button
                                                type="button"
                                                className="admin-user-role__delete"
                                                onClick={async () => {
                                                    const response =
                                                        await rolesService.detach(
                                                            data.id,
                                                            role.id,
                                                        );

                                                    if (response) {
                                                        notify(
                                                            `Роль ${role.name} снята`,
                                                            NotifyTypes.SUCCESS,
                                                        );

                                                        await refetch();
                                                    }
                                                }}
                                            >
                                                X
                                            </button>

                                            {role.description}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="profile-edit__group admin-user__group">
                        <h3>Основная информация</h3>

                        <button
                            type="button"
                            className="admin-user__remove"
                            onClick={async () => {
                                const response = await usersService.delete(
                                    data.id,
                                );

                                if (response) {
                                    notify(
                                        'Пользователь удален',
                                        NotifyTypes.SUCCESS,
                                    );
                                    navigate('/admin/users');
                                }
                            }}
                        >
                            Удалить
                        </button>

                        <div className="profile-edit__horizontal">
                            <div
                                className={cn(
                                    'profile-edit-avatar',
                                    errors?.avatar &&
                                        'profile-edit-avatar_error',
                                )}
                            >
                                <label
                                    htmlFor="avatarInput"
                                    className="profile-edit-avatar__label"
                                >
                                    <div className="profile-edit-avatar-preview">
                                        {preview ? (
                                            <img
                                                className="profile-edit-avatar-preview__image"
                                                src={preview}
                                                alt=""
                                            />
                                        ) : (
                                            <div className="profile-edit-avatar-preview__placeholder" />
                                        )}
                                    </div>

                                    <span>Изменить аватар</span>
                                </label>

                                <input
                                    type="file"
                                    name="avatar"
                                    className="profile-edit-avatar__input"
                                    id="avatarInput"
                                    accept="image/png, image/jpeg"
                                    onChange={(event) => {
                                        const { files } = event.target;

                                        const file = files?.item(0);

                                        if (file) {
                                            setPreview(
                                                URL.createObjectURL(file),
                                            );
                                        }
                                    }}
                                />
                            </div>

                            <div className="profile-edit__group">
                                <GInput
                                    type="text"
                                    title="Имя"
                                    defaultValue={data.name}
                                    name="name"
                                    autoComplete="off"
                                    customClass="profile-edit__input"
                                    errors={errors?.name}
                                />

                                <GInput
                                    type="text"
                                    title="Рег. данные"
                                    defaultValue={data.uid}
                                    name="uid"
                                    autoComplete="off"
                                    hint="Номер вашей ID-карты"
                                    customClass="profile-edit__input"
                                    reference={uid}
                                    errors={errors?.uid}
                                />

                                <GInput
                                    type="text"
                                    title="Почта"
                                    defaultValue={data.email}
                                    name="email"
                                    autoComplete="off"
                                    hint="Дискорд, пример: dystopia.there"
                                    errors={errors?.email}
                                />

                                <GInput
                                    type="text"
                                    title="Номер телефона"
                                    defaultValue={data.phone}
                                    name="phone"
                                    autoComplete="off"
                                    hint="Номер телефона, пример: 999-9999"
                                    errors={errors?.phone}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="profile-edit__group">
                        <h3>Изменение пароля</h3>

                        <GInput
                            type="password"
                            title="Новый пароль"
                            name="new_password"
                            reference={newPassword}
                            autoComplete="off"
                            customClass="profile-edit__input"
                            errors={errors?.new_password}
                        />

                        <GInput
                            type="password"
                            title="Подтверждение нового пароля"
                            name="new_password_confirmation"
                            reference={newPasswordConfirmation}
                            autoComplete="off"
                            customClass="profile-edit__input"
                            errors={errors?.new_password_confirmation}
                        />
                    </div>

                    {data.organization && data.organization.data && (
                        <div className="profile-edit__group admin-user__group">
                            <h3>Организация</h3>

                            <button
                                type="button"
                                className="admin-user__remove"
                                onClick={async () => {
                                    const organization = data.organization
                                        .data as IOrganization;

                                    const response =
                                        await employeesService.dissociate(
                                            organization.id,
                                            data.id,
                                        );

                                    if (response) {
                                        notify(
                                            'Пользователь уволен',
                                            NotifyTypes.SUCCESS,
                                        );

                                        await refetch();
                                    }
                                }}
                            >
                                Уволить
                            </button>

                            <div className="profile-edit__group">
                                <h4>Роли</h4>

                                <div className="profile-view-roles">
                                    {data.organization.roles.data
                                        .slice()
                                        .sort(
                                            (roleA, roleB) =>
                                                roleB.priority - roleA.priority,
                                        )
                                        .map((role) => {
                                            return (
                                                <div
                                                    className="profile-view-roles__role admin-user-role"
                                                    key={role.id}
                                                >
                                                    <button
                                                        type="button"
                                                        className="admin-user-role__delete"
                                                        onClick={async () => {
                                                            const organization =
                                                                data
                                                                    .organization
                                                                    .data as IOrganization;

                                                            const response =
                                                                await organizationRolesService.detach(
                                                                    organization.id,
                                                                    data.id,
                                                                    role.id,
                                                                );

                                                            if (response) {
                                                                notify(
                                                                    `Роль организации ${role.name} снята`,
                                                                    NotifyTypes.SUCCESS,
                                                                );

                                                                await refetch();
                                                            }
                                                        }}
                                                    >
                                                        X
                                                    </button>

                                                    {role.description}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>

                            <div className="profile-edit__group">
                                <h4>Информация</h4>

                                <div className="organization-view__horizontal">
                                    <div className="organization-view-avatar">
                                        <div className="organization-view-avatar__content">
                                            {data.organization.data.avatar ? (
                                                <img
                                                    className="organization-view-avatar__image"
                                                    src={
                                                        data.organization.data
                                                            .avatar
                                                    }
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

                                            <span>
                                                {data.organization.data.name}
                                            </span>
                                        </div>

                                        <div className="organization-view-info__field">
                                            <div className="organization-view-info__title">
                                                Владелец
                                            </div>

                                            <span>
                                                {
                                                    data.organization.data.owner
                                                        .name
                                                }
                                            </span>
                                        </div>

                                        <div className="organization-view-info__field">
                                            <div className="organization-view-info__title">
                                                Работники
                                            </div>

                                            <span>
                                                {
                                                    data.organization.data
                                                        .employees_count
                                                }
                                            </span>
                                        </div>

                                        <div className="organization-view-info__field">
                                            <div className="organization-view-info__title">
                                                Описание
                                            </div>

                                            <span>
                                                {
                                                    data.organization.data
                                                        .description
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="organization-view__group">
                                    <h4>Смены</h4>

                                    <div className="organization-view-shifts">
                                        {Object.entries(
                                            calculateShifts(
                                                data.organization.shifts.data,
                                            ),
                                        ).map(([day, shifts]) => {
                                            const hours = shifts.reduce(
                                                (prev, sheet) => {
                                                    return prev + sheet.hours;
                                                },
                                                0,
                                            );

                                            const ended = shifts.every(
                                                (value) => value.ended,
                                            );

                                            const titles = days[day as Days];

                                            const nowDate = formatDate(
                                                new Date(),
                                            );

                                            return (
                                                <div
                                                    key={day}
                                                    className={cn(
                                                        'organization-view-shifts-day',
                                                        titles.date ===
                                                            nowDate &&
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
                                                        {hours
                                                            ? `${hours} ч.`
                                                            : 'Пусто'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <GInput
                        type="password"
                        title="Пароль администратора"
                        name="password"
                        reference={password}
                        autoComplete="off"
                        customClass="profile-edit__input"
                        errors={errors?.password}
                    />

                    <GButton title="Сохранить" submit />
                </form>
            </div>
        )
    );
}

export default AdminUser;
