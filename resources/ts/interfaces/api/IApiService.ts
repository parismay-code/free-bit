import {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';

export default interface IApiService {
    readonly client: AxiosInstance;

    csrfToken(): Promise<boolean>;

    fetch<R = unknown, D = unknown, E = unknown>(
        method: ApiMethods,
        url: string,
        data: D | undefined,
        config: AxiosRequestConfig<D> | undefined,
    ): Promise<Response<R, D, E>>;
}

export type Response<R, D, E> = AxiosResponse<R, D> | AxiosError<E, D> | false;

export interface IApiError<E> {
    data: E | undefined;
}

export type ApiMethods = 'get' | 'post' | 'patch';

export type Paginated<D = unknown> = {
    current_page: number;
    data: Array<D>;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<unknown>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};
