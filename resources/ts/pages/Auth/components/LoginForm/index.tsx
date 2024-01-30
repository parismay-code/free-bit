import { type SyntheticEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';

import type { ILoginRequest } from '@interfaces/api/IAuthApiService';

import ApiError from '@services/api/ApiError';
import AuthApiService from '@services/api/auth/AuthApiService';

import { setUser } from '@stores/authReducer';

import GInput from '@components/GInput';
import GButton from '@components/GButton';

const authService = new AuthApiService();

type FormFields = 'uid' | 'password';

function LoginForm() {
    const [isError, setError] = useState<boolean>(false);

    const uid = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();

        if (!uid.current || !password.current) {
            return;
        }

        const data: ILoginRequest = {
            uid: uid.current.value,
            password: password.current.value,
        };

        const result = await authService.login<FormFields>(data);

        if (result instanceof ApiError) {
            setError(true);

            return;
        }

        if (result) {
            dispatch(setUser(result));

            navigate('/');
        }
    };

    return (
        <form className="auth-form" autoComplete="off" onSubmit={handleSubmit}>
            <div className={cn('auth-form__error', !isError && 'hidden')}>
                Неверные регистрационные данные или пароль
            </div>

            <GInput
                type="text"
                title="Рег. данные"
                name="uid"
                reference={uid}
                autoComplete="off"
                hint="Номер вашей ID-карты"
            />
            <GInput
                type="password"
                title="Пароль"
                name="password"
                reference={password}
                autoComplete="off"
            />
            <GButton title="Войти" submit />
        </form>
    );
}

export default LoginForm;
