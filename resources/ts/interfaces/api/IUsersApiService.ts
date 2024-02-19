import type { Paginated } from '@interfaces/api/IApiService';
import type IUser from '@interfaces/models/IUser';
import type { IFullUser } from '@interfaces/models/IUser';
import type { ValidatedReturnType } from '@interfaces/api/IAuthApiService';

export default interface IUsersApiService {
    getAll(
        page: number,
        q: undefined | string,
    ): Promise<Paginated<IUser> | false>;

    get(userId: number): Promise<IFullUser | false>;

    update<F extends string = string>(
        userId: number,
        data: FormData,
    ): ValidatedReturnType<F, IFullUser, FormData>;

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
