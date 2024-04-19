import { withErrorBoundary } from 'react-error-boundary';
import { LoginFlow } from '~features/user';
import { ErrorHandler } from '~shared/ui/error';

function Page() {
    return (
        <div className="page">
            <h1 className="page__title">Вход</h1>

            <LoginFlow />
        </div>
    );
}

export const LoginPage = withErrorBoundary(Page, {
    fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});
