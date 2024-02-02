import type { FC } from 'react';

export default interface IPopUp {
    title: string;
    component: FC<PopUpProps>;
}

export interface PopUpProps {
    prev: () => void;
    close: () => void;
}
