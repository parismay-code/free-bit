import { type IFullUser } from '@interfaces/models/IUser';

export interface IState {
    user: IFullUser | false;
}
