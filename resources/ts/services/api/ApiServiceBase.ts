import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';

import IApiService, { ApiMethods, Response } from '@interfaces/api/IApiService';

const API_URL = import.meta.env.VITE_APP_URL;
const API_PORT = import.meta.env.VITE_APP_PORT;

export default class ApiServiceBase implements IApiService {
    public readonly client: AxiosInstance = axios.create({
        baseURL: `${API_URL}:${API_PORT}/api`,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        withCredentials: true,
        withXSRFToken: true,
    });

    public csrfToken = async (): Promise<boolean> => {
        await this.fetch('get', '/sanctum/csrf-cookie');

        return true;
    };

    public fetch = async <R = unknown, D = unknown, E = unknown>(
        method: ApiMethods,
        url: string,
        data: D | undefined = undefined,
        config: AxiosRequestConfig<D> | undefined = undefined,
    ): Promise<Response<R, D, E>> => {
        try {
            if (method === 'get') {
                return await this.client.get<R, AxiosResponse<R, D>, D>(
                    url,
                    config,
                );
            }

            if (Object.hasOwn(this.client, method)) {
                return await this.client[method]<R, AxiosResponse<R, D>, D>(
                    url,
                    data,
                    config,
                );
            }

            return false;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return e as AxiosError<E, D>;
            }

            return false;
        }
    };
}
