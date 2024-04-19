import { ErrorMessage, Field, Form, useFormikContext } from 'formik';

type LoginFormProps = {
    isPending: boolean;
};

export function LoginForm(props: LoginFormProps) {
    return (
        <Form className="form">
            <fieldset disabled={props.isPending} className="form__group">
                <fieldset className="form__group">
                    <Field
                        name="uid"
                        className="form__control ttu"
                        type="text"
                        placeholder="Рег. данные"
                    />
                    <span className="form__error">
                        <ErrorMessage className="form__error" name="email" />
                    </span>
                </fieldset>
                <fieldset className="form__group">
                    <Field
                        name="password"
                        className="form__control"
                        type="password"
                        placeholder="Пароль"
                    />
                    <span className="form__error">
                        <ErrorMessage className="form__error" name="password" />
                    </span>
                </fieldset>
                <SubmitButton />
            </fieldset>
        </Form>
    );
}

function SubmitButton() {
    const { isValidating, isValid } = useFormikContext();

    return (
        <button
            className="button filled form__submit"
            type="submit"
            disabled={!isValid || isValidating}
        >
            Войти
        </button>
    );
}
