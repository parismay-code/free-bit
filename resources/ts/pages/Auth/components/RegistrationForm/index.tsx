import { type SyntheticEvent, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { IRegisterRequest } from '@interfaces/api/IAuthApiService';

import AuthApiService from '@services/api/auth/AuthApiService';
import ApiError from '@services/api/ApiError';

import { setUser } from '@stores/authReducer';

import GInput from '@components/GInput';
import GButton from '@components/GButton';

const authService = new AuthApiService();

function RegistrationForm() {
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
            uid: uid.current.value,
            email: email.current.value,
            phone: phone.current.value,
            password: password.current.value,
            password_confirmation: passwordConfirmation.current.value,
        };

        const result = await authService.register(data);

        if (result instanceof ApiError) {
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
            />
            <GInput
                type="text"
                title="Рег. данные"
                name="uid"
                reference={uid}
                autoComplete="off"
            />
            <GInput
                type="text"
                title="Почта"
                name="email"
                reference={email}
                autoComplete="off"
            />
            <GInput
                type="phone"
                title="Номер телефона"
                name="phone"
                reference={phone}
                autoComplete="off"
            />
            <GInput
                type="password"
                title="Пароль"
                name="password"
                reference={password}
                autoComplete="off"
            />
            <GInput
                type="password"
                title="Повтор пароля"
                name="password_confirmation"
                reference={passwordConfirmation}
                autoComplete="off"
            />
            <GButton title="Продолжить" submit />
        </form>
    );
}

export default RegistrationForm;
