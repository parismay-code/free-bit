import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { withErrorBoundary } from 'react-error-boundary';
import {
    sessionContracts,
    sessionQueries,
    sessionTypes,
} from '~entities/session';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';

function Page() {
    const {
        mutate: registerUser,
        isPending,
        isError,
        error,
    } = sessionQueries.useRegisterUserMutation();

    return (
        <div className="auth-page">
            <div className="container page">
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-xs-12">
                        <h1 className="text-xs-center">Регистрация</h1>

                        {isError && <ErrorHandler error={error} />}

                        <Formik
                            initialValues={initialUser}
                            validate={formikContract(
                                sessionContracts.RegisterUserDtoSchema,
                            )}
                            onSubmit={(user) => registerUser({ user })}
                        >
                            <Form>
                                <fieldset disabled={isPending}>
                                    <fieldset className="form-group">
                                        <Field
                                            name="uid"
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Рег. данные"
                                        />
                                        <ErrorMessage name="uid" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <Field
                                            name="name"
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Имя"
                                        />
                                        <ErrorMessage name="name" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <Field
                                            name="email"
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Дискорд"
                                        />
                                        <ErrorMessage name="email" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <Field
                                            name="phone"
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Номер телефона"
                                        />
                                        <ErrorMessage name="phone" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <Field
                                            name="password"
                                            className="form-control form-control-lg"
                                            type="password"
                                            placeholder="Пароль"
                                        />
                                        <ErrorMessage name="password" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <Field
                                            name="password_confirmation"
                                            className="form-control form-control-lg"
                                            type="password"
                                            placeholder="Повтор пароля"
                                        />
                                        <ErrorMessage name="password_confirmation" />
                                    </fieldset>
                                    <SubmitButton />
                                </fieldset>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}

const initialUser: sessionTypes.RegisterUserDto = {
    uid: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
};

function SubmitButton() {
    const { isValidating, isValid } = useFormikContext();

    return (
        <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={!isValid || isValidating}
        >
            Зарегистироваться
        </button>
    );
}

export const RegistrationPage = withErrorBoundary(Page, {
    fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});
