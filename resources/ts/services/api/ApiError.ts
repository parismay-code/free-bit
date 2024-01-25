import { AxiosError } from 'axios';

import { IApiError } from '@interfaces/api/IApiService';

export default class ApiError<E, D> implements IApiError<E> {
    public readonly data: E | undefined;

    constructor(response: AxiosError<E, D>) {
        this.data = response.response?.data;
    }
}
