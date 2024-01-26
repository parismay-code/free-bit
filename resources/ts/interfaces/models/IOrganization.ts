import type IUser from '@interfaces/models/IUser';

export default interface IOrganization {
    id: number;
    name: string;
    description: string;
    owner: IUser;
}
