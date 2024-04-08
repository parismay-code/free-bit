import { getCookie } from '~shared/lib/cookie';

export function hasToken(): boolean {
    return !!getCookie('token');
}
