import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import type { LayoutContext } from '@components/ProtectedLayout';

const useHeaderTitle = (title?: string) => {
    const { setHeaderTitle } = useOutletContext<LayoutContext>();

    useEffect(() => {
        setHeaderTitle(title);

        return () => {
            setHeaderTitle(undefined);
        };
    }, [title, setHeaderTitle]);
};

export default useHeaderTitle;
