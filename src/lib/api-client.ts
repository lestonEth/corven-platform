// src/lib/api-client.ts
import { env } from '../config/env';
import { tokenStorage } from './token-storage';

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly details?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface RequestOptions extends RequestInit {
    authenticated?: boolean;
}

export async function apiClient<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const {
        authenticated = true,
        headers,
        ...requestOptions
    } = options;

    const token = tokenStorage.get();

    const response = await fetch(`${env.apiUrl}${path}`, {
        ...requestOptions,

        headers: {
            Accept: 'application/json',

            ...(requestOptions.body
                ? { 'Content-Type': 'application/json' }
                : {}),

            ...(authenticated && token
                ? { Authorization: `Bearer ${token}` }
                : {}),

            ...headers,
        },
    });

    const contentType = response.headers.get('content-type');

    const body = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message =
            typeof body === 'object' &&
                body !== null &&
                'message' in body
                ? String(body.message)
                : `Request failed with status ${response.status}`;

        throw new ApiError(message, response.status, body);
    }

    return body as T;
}