// src/features/auth/api/auth.api.ts

import { apiClient } from '../../../lib/api-client';

import {
    AuthResponse,
    AuthUser,
    LoginInput,
    RegisterInput,
    WalletChallengeInput,
    WalletChallengeResponse,
    WalletLoginInput,
} from '../types/auth.types';

export const authApi = {
    login(input: LoginInput): Promise<AuthResponse> {
        return apiClient<AuthResponse>('/auth/login', {
            method: 'POST',
            authenticated: false,
            body: JSON.stringify(input),
        });
    },

    register(input: RegisterInput): Promise<AuthResponse> {
        return apiClient<AuthResponse>('/auth/register', {
            method: 'POST',
            authenticated: false,
            body: JSON.stringify(input),
        });
    },

    createWalletChallenge(
        input: WalletChallengeInput,
    ): Promise<WalletChallengeResponse> {
        return apiClient<WalletChallengeResponse>(
            '/auth/wallet/challenge',
            {
                method: 'POST',
                authenticated: false,
                body: JSON.stringify(input),
            },
        );
    },

    walletLogin(
        input: WalletLoginInput,
    ): Promise<AuthResponse> {
        return apiClient<AuthResponse>('/auth/wallet/login', {
            method: 'POST',
            authenticated: false,
            body: JSON.stringify(input),
        });
    },

    getCurrentUser(): Promise<AuthUser> {
        return apiClient<AuthUser>('/auth/me');
    },
};