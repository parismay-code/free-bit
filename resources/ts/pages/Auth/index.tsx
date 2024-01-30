import { useEffect, useState } from 'react';
import cn from 'classnames';

import usePopUp from '@hooks/usePopUp';

import logo from '@assets/logo.svg';

import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';

import './auth.scss';

function Auth() {
    const [form, setForm] = useState<'login' | 'registration'>('login');

    const popUp = usePopUp();

    useEffect(() => {
        if (!localStorage.getItem('visited')) {
            popUp('Добро пожаловать', '<div>Информационный текст</div>');
            localStorage.setItem('visited', '1');
        }
    }, []);

    return (
        <main className="auth container">
            <img className="auth__logo" src={logo} alt="" />

            <section className="auth-tabs">
                <div
                    className={cn(
                        'auth-tabs__slider',
                        form === 'login'
                            ? 'auth-tabs__slider_left'
                            : 'auth-tabs__slider_right',
                    )}
                />

                <button
                    className={cn(
                        'auth-tabs__button',
                        form === 'login' && 'auth-tabs__button_active',
                    )}
                    type="button"
                    onClick={() => {
                        setForm('login');
                    }}
                >
                    Вход
                </button>

                <button
                    className={cn(
                        'auth-tabs__button',
                        form === 'registration' && 'auth-tabs__button_active',
                    )}
                    type="button"
                    onClick={() => {
                        setForm('registration');
                    }}
                >
                    Регистрация
                </button>
            </section>

            <section className="auth__content">
                {form === 'login' && <LoginForm />}
                {form === 'registration' && <RegistrationForm />}
            </section>
        </main>
    );
}

export default Auth;
