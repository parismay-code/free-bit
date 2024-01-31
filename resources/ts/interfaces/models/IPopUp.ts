import type { FC } from 'react';

export default interface IPopUp {
    title: string;
    component: FC<IPopUpProps>;
}

export interface IPopUpProps {
    prev: () => void;
    close: () => void;
}
