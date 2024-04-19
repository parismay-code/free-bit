import { ErrorMessage, Field, Form, useFormikContext } from 'formik';

type RegistrationFormProps = {
    isPending: boolean;
};

export function RegistrationForm(props: RegistrationFormProps) {
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
                        <ErrorMessage name="uid" />
                    </span>
                </fieldset>
                <fieldset className="form__group">
                    <Field
                        name="name"
                        className="form__control cpt"
                        type="text"
                        placeholder="Имя"
                    />
                    <span className="form__error">
                        <ErrorMessage className="form__error" name="name" />
                    </span>
                </fieldset>
                <fieldset className="form__group">
                    <Field
                        name="email"
                        className="form__control"
                        type="text"
                        placeholder="Дискорд"
                    />
                    <span className="form__error">
                        <ErrorMessage className="form__error" name="email" />
                    </span>
                </fieldset>
                <fieldset className="form__group">
                    <Field
                        name="phone"
                        className="form__control"
                        type="text"
                        placeholder="Номер телефона"
                    />
                    <span className="form__error">
                        <ErrorMessage className="form__error" name="phone" />
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
                <fieldset className="form__group">
                    <Field
                        name="password_confirmation"
                        className="form__control"
                        type="password"
                        placeholder="Повтор пароля"
                    />
                    <span className="form__error">
                        <ErrorMessage
                            className="form__error"
                            name="password_confirmation"
                        />
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
            Зарегистироваться
        </button>
    );
}
