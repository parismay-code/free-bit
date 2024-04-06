import { User, UserDto } from './types';

export function mapUser(userDto: UserDto): User {
    return {
        ...userDto.user,
    };
}
