import { useDispatch } from 'react-redux';

import { NotifyTypes } from '@interfaces/models/INotify';

import { addNotify } from '@stores/notifyReducer';

const useNotify = () => {
    const dispatch = useDispatch();

    return (
        text: string,
        type: NotifyTypes = NotifyTypes.SUCCESS,
        duration: number = 4000,
    ) => {
        dispatch(addNotify({ text, type, duration }));
    };
};

export default useNotify;
