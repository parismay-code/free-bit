import { withErrorBoundary } from 'react-error-boundary';
import { RegistrationFlow } from '~features/user';
import { ErrorHandler } from '~shared/ui/error';

function Page() {
    return (
        <div className="page">
            <h1 className="page__title">Регистрация</h1>

            <RegistrationFlow />
        </div>
    );
}

export const RegistrationPage = withErrorBoundary(Page, {
    fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});
