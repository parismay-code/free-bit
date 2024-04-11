import { httpError, networkError, preparationError } from './errors';
import { formatUrl, formatHeaders } from './lib';
import { HttpMethod, RequestBody, FetchApiRecord } from './types';

interface ApiRequest {
    method: HttpMethod;
    body?: RequestBody;
    headers?: FetchApiRecord;
    query?: FetchApiRecord;
    url: string;
}

interface ApiConfig {
    request: ApiRequest;
    abort?: AbortSignal;
}

export async function createApiRequest(config: ApiConfig) {
    const response = await fetch(
        formatUrl({
            href: config.request.url,
            query: config.request.query || {},
        }),
        {
            method: config.request.method,
            mode: 'cors',
            credentials: 'include',
            headers: formatHeaders(config.request.headers || {}),
            body: config.request.body,
            signal: config?.abort,
        },
    ).catch((error) => {
        throw networkError({
            reason: error?.message ?? null,
            cause: error,
        });
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw httpError({
            status: response.status,
            statusText: response.statusText,
            response: (await response.text().catch(() => null)) ?? null,
        });
    }

    const clonedResponse = response.clone();

    if (!response.body) {
        return null;
    }

    const data = await response.json().catch(async (error) => {
        throw preparationError({
            response: await clonedResponse.text(),
            reason: error?.message ?? null,
        });
    });

    return data;
}
