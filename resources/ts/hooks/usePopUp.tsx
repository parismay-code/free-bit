import { useDispatch } from 'react-redux';
import type { ReactNode } from 'react';

import { openPopUp } from '@stores/popUpReducer';
import type { IPopUpProps } from '@interfaces/models/IPopUp.ts';

const usePopUp = () => {
    const dispatch = useDispatch();

    return (
        title: string,
        component: ({ prev, close }: IPopUpProps) => JSX.Element,
    ) => {
        dispatch(openPopUp({ title, component }));
    };
};

export default usePopUp;
