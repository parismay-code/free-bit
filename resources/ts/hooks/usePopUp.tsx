import { useDispatch } from 'react-redux';

import type { PopUpProps } from '@interfaces/models/IPopUp';

import { openPopUp } from '@stores/popUpReducer';

const usePopUp = () => {
    const dispatch = useDispatch();

    return (
        title: string,
        component: ({ prev, close }: PopUpProps) => JSX.Element,
    ) => {
        dispatch(openPopUp({ title, component }));
    };
};

export default usePopUp;
