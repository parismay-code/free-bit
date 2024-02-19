import { useDispatch } from 'react-redux';

import { closePopUp, openPopUp, prevPopUp } from '@stores/popUpReducer';
import type { ReactElement } from 'react';

const usePopUp = () => {
    const dispatch = useDispatch();

    const close = () => dispatch(closePopUp());
    const prev = () => dispatch(prevPopUp());

    return {
        close,
        prev,
        open: (title: string, component: ReactElement) => {
            dispatch(openPopUp({ title, component }));
        },
    };
};

export default usePopUp;
