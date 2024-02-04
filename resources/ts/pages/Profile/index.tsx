import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import cn from 'classnames';

import useHeaderTitle from '@hooks/useHeaderTitle';
import useNotify from '@hooks/useNotify';

import { NotifyTypes } from '@interfaces/models/INotify';

import type { LayoutContext } from '@components/ProtectedLayout';

import UsersApiService from '@services/api/users/UsersApiService';
import AuthApiService from '@services/api/auth/AuthApiService';
import ApiError from '@services/api/ApiError';

import { setUser } from '@stores/authReducer';

import GInput from '@components/GInput';
import GButton from '@components/GButton';

import './profile.scss';

const usersService = new UsersApiService();
const authService = new AuthApiService();

type FormFields =
    | 'avatar'
    | 'name'
    | 'uid'
    | 'email'
    | 'phone'
    | 'password'
    | 'new_password'
    | 'new_password_confirmation';

function Profile() {
    const { user } = useOutletContext<LayoutContext>();

    const [errors, setErrors] =
        useState<Record<FormFields, Array<string> | undefined>>();
    const [preview, setPreview] = useState<string | null>(user.avatar);

    const dispatch = useDispatch();

    const notify = useNotify();
    const navigate = useNavigate();

    const form = useRef<HTMLFormElement>(null);
    const uid = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const newPassword = useRef<HTMLInputElement>(null);
    const newPasswordConfirmation = useRef<HTMLInputElement>(null);

    useHeaderTitle(user.name);

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
            !form.current ||
            !uid.current ||
            !password.current ||
            !newPassword.current ||
            !newPasswordConfirmation.current
        ) {
            return;
        }

        const data = new FormData(form.current);

        if (uid.current.value === user.uid) {
            data.delete('uid');
        }

        if (!password.current.value) {
            data.delete('password');
        }

        if (!newPassword.current.value) {
            data.delete('new_password');
        }

        if (!newPasswordConfirmation.current.value) {
            data.delete('new_password_confirmation');
        }

        const result = await usersService.update<FormFields>(user.id, data);

        if (result instanceof ApiError) {
            if (result.data) {
                setErrors(result.data.errors);
            }

            return;
        }

        if (result) {
            dispatch(setUser(result));
            setErrors(undefined);
            notify('Данные профиля успешно изменены', NotifyTypes.SUCCESS);

            password.current.value = '';
            newPassword.current.value = '';
            newPasswordConfirmation.current.value = '';
        } else {
            setErrors({
                password: ['Wrong password'],
                uid: undefined,
                new_password: undefined,
                new_password_confirmation: undefined,
                name: undefined,
                email: undefined,
                phone: undefined,
                avatar: undefined,
            });
        }
    };

    const handleLogout = async () => {
        const result = await authService.logout();

        if (result) {
            dispatch(setUser(false));
            navigate('/auth');
            notify('Вы вышли из аккаунта', NotifyTypes.INFO);
        }
    };

    return (
        <div className="profile container">
            <button
                className="profile__logout"
                type="button"
                onClick={handleLogout}
            >
                Выйти
            </button>

            <form ref={form} className="profile-edit" onSubmit={handleSubmit}>
                <div className="profile-edit__group">
                    <h3>Основная информация</h3>

                    <div className="profile-edit__horizontal">
                        <div
                            className={cn(
                                'profile-edit-avatar',
                                errors?.avatar && 'profile-edit-avatar_error',
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
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>

                        <div className="profile-edit__group">
                            <GInput
                                type="text"
                                title="Имя"
                                defaultValue={user.name}
                                name="name"
                                autoComplete="off"
                                customClass="profile-edit__input"
                                errors={errors?.name}
                            />

                            <GInput
                                type="text"
                                title="Рег. данные"
                                defaultValue={user.uid}
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
                                defaultValue={user.email}
                                name="email"
                                autoComplete="off"
                                hint="Дискорд, пример: dystopia.there"
                                errors={errors?.email}
                            />

                            <GInput
                                type="text"
                                title="Номер телефона"
                                defaultValue={user.phone}
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

                <GInput
                    type="password"
                    title="Пароль"
                    name="password"
                    reference={password}
                    autoComplete="off"
                    customClass="profile-edit__input"
                    errors={errors?.password}
                />

                <GButton title="Сохранить" submit />
            </form>
        </div>
    );
}

export default Profile;
