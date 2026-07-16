// src/config/env.ts
function requiredEnv(
    value: string | undefined,
    name: string,
): string {
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

export const env = {
    apiUrl: requiredEnv(
        import.meta.env.VITE_API_URL,
        'VITE_API_URL',
    ),

    terminalUrl: requiredEnv(
        import.meta.env.VITE_TERMINAL_URL,
        'VITE_TERMINAL_URL',
    ),
};