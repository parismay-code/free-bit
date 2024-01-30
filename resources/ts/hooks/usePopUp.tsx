import { useDispatch } from 'react-redux';
import type { ReactNode } from 'react';

import { openPopUp } from '@stores/popUpReducer';

const usePopUp = () => {
    const dispatch = useDispatch();

    return (title: string, component: ReactNode) => {
        dispatch(openPopUp({ title, component }));
    };
};

export default usePopUp;
