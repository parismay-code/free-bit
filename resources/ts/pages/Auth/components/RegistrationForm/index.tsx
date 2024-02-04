import { type SyntheticEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { IRegisterRequest } from '@interfaces/api/IAuthApiService';

import AuthApiService from '@services/api/auth/AuthApiService';
import ApiError from '@services/api/ApiError';

import { setUser } from '@stores/authReducer';

import GInput from '@components/GInput';
import GButton from '@components/GButton';

const authService = new AuthApiService();

type FormFields =
    | 'name'
    | 'uid'
    | 'email'
    | 'phone'
    | 'password'
    | 'password_confirmation';

function RegistrationForm() {
    const [errors, setErrors] = useState<Record<FormFields, Array<string>>>();

    const name = useRef<HTMLInputElement>(null);
    const uid = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const phone = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const passwordConfirmation = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();

        if (
            !name.current ||
            !uid.current ||
            !email.current ||
            !phone.current ||
            !password.current ||
            !passwordConfirmation.current
        ) {
            return;
        }

        const data: IRegisterRequest = {
            name: name.current.value,
            uid: uid.current.value.toUpperCase(),
            email: email.current.value,
            phone: phone.current.value,
            password: password.current.value,
            password_confirmation: passwordConfirmation.current.value,
        };

        const result = await authService.register<FormFields>(data);

        if (result instanceof ApiError) {
            if (result.data) {
                setErrors(result.data.errors);
            }

            return;
        }

        if (result) {
            dispatch(setUser(result));

            navigate('/');
        }
    };

    return (
        <form className="auth-form" autoComplete="off" onSubmit={handleSubmit}>
            <GInput
                type="text"
                title="Имя"
                name="name"
                reference={name}
                autoComplete="off"
                hint="Имя вашего персонажа"
                errors={errors?.name}
            />
            <GInput
                type="text"
                title="Рег. данные"
                name="uid"
                reference={uid}
                autoComplete="off"
                hint="Номер вашей ID-карты"
                errors={errors?.uid}
                customClass="auth__input"
            />
            <GInput
                type="text"
                title="Почта"
                name="email"
                reference={email}
                autoComplete="off"
                hint="Дискорд, пример: dystopia.there"
                errors={errors?.email}
            />
            <GInput
                type="text"
                title="Номер телефона"
                name="phone"
                reference={phone}
                autoComplete="off"
                hint="Номер телефона, пример: 999-9999"
                errors={errors?.phone}
            />
            <GInput
                type="password"
                title="Пароль"
                name="password"
                reference={password}
                autoComplete="off"
                errors={errors?.password}
            />
            <GInput
                type="password"
                title="Повтор пароля"
                name="password_confirmation"
                reference={passwordConfirmation}
                autoComplete="off"
                errors={errors?.password_confirmation}
            />
            <GButton title="Продолжить" submit />
        </form>
    );
}

export default RegistrationForm;
