import type { Collection } from '@interfaces/api/IApiService';
import type IUser from '@interfaces/models/IUser';

export default interface IRole {
    id: number;
    name: string;
    description: string;
}

export interface IFullRole {
    users: Collection<IUser>;
}
