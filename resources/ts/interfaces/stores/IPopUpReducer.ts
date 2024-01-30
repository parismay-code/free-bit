import type IPopUp from '@interfaces/models/IPopUp';

export interface IState {
    trace: Array<IPopUp>;
    current: IPopUp | null;
}
