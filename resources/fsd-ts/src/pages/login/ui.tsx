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
        mutate: loginUser,
        isPending,
        isError,
        error,
    } = sessionQueries.useLoginUserMutation();

    return (
        <div className="auth-page">
            <div className="container page">
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-xs-12">
                        <h1 className="text-xs-center">Вход</h1>

                        {isError && <ErrorHandler error={error} />}

                        <Formik
                            initialValues={initialUser}
                            validate={formikContract(
                                sessionContracts.LoginUserDtoSchema,
                            )}
                            onSubmit={(user) => loginUser({ user })}
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
                                        <ErrorMessage name="email" />
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

const initialUser: sessionTypes.LoginUserDto = {
    uid: '',
    password: '',
};

function SubmitButton() {
    const { isValidating, isValid } = useFormikContext();

    return (
        <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={!isValid || isValidating}
        >
            Войти
        </button>
    );
}

export const LoginPage = withErrorBoundary(Page, {
    fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});
