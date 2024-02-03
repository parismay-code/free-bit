import type { Collection } from '@interfaces/api/IApiService';
import type IUser from '@interfaces/models/IUser';
import type { IFullUser } from '@interfaces/models/IUser';

export default interface IUsersApiService {
    getAll(): Promise<Collection<IUser> | false>;

    get(userId: number): Promise<IFullUser | false>;

    update(userId: number, data: FormData): Promise<IFullUser | false>;

    delete(userId: number): Promise<boolean>;
}

export interface IUserRequest {
    name?: string;
    uid?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    password: string;
    new_password?: string;
    new_password_confirmation?: string;
}
