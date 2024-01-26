import { useState } from 'react';
import cn from 'classnames';

import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';

import './auth.scss';

function Auth() {
    const [form, setForm] = useState<'login' | 'registration'>('login');

    return (
        <main className="auth container">
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
