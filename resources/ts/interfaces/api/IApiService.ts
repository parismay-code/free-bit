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

export type ApiMethods =
    | 'get'
    | 'post'
    | 'postForm'
    | 'patch'
    | 'patchForm'
    | 'delete';

export type Collection<D = unknown> = {
    data: Array<D>;
};

export type Paginated<D = unknown> = {
    data: Array<D>;
    links: {
        next: string | null;
        prev: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export interface IAttachWitchCountRequest {
    count: number;
}
