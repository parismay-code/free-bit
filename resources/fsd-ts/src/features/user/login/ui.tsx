import { Formik } from 'formik';
import {
    sessionContracts,
    sessionQueries,
    sessionTypes,
} from '~entities/session';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';
import { LoginForm } from '~widgets/login-form';

const initialUser: sessionTypes.LoginUserDto = {
    uid: '',
    password: '',
};

export function LoginFlow() {
    const {
        mutate: loginUser,
        isPending,
        isError,
        error,
    } = sessionQueries.useLoginUserMutation();

    return (
        <>
            {isError && <ErrorHandler error={error} />}

            <Formik
                initialValues={initialUser}
                validate={formikContract(sessionContracts.LoginUserDtoSchema)}
                onSubmit={(user) => loginUser({ user })}
            >
                <LoginForm isPending={isPending} />
            </Formik>
        </>
    );
}
