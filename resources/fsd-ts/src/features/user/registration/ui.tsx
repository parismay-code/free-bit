import { Formik } from 'formik';
import {
    sessionContracts,
    sessionQueries,
    sessionTypes,
} from '~entities/session';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';
import { RegistrationForm } from '~widgets/registration-form';

const initialUser: sessionTypes.RegisterUserDto = {
    uid: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
};

export function RegistrationFlow() {
    const {
        mutate: registerUser,
        isPending,
        isError,
        error,
    } = sessionQueries.useRegisterUserMutation();

    return (
        <>
            {isError && <ErrorHandler error={error} />}

            <Formik
                initialValues={initialUser}
                validate={formikContract(
                    sessionContracts.RegisterUserDtoSchema,
                )}
                onSubmit={(user) => registerUser({ user })}
            >
                <RegistrationForm isPending={isPending} />
            </Formik>
        </>
    );
}
