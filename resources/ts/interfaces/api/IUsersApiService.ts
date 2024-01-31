import type { Collection } from '@interfaces/api/IApiService';
import type IUser from '@interfaces/models/IUser';
import type { IFullUser } from '@interfaces/models/IUser';

export default interface IUsersApiService {
    getAll(): Promise<Collection<IUser> | false>;

    get(userId: number): Promise<IFullUser | false>;
}
