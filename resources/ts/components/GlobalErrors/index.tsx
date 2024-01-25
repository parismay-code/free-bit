import type { FallbackProps } from 'react-error-boundary';

function GlobalErrors({ error }: FallbackProps) {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
        </div>
    );
}

export default GlobalErrors;
