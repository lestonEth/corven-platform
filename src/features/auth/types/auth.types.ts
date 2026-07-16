// src/features/auth/types/auth.types.ts

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    createdAt?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: AuthUser;
}

export interface VerifyTokenResponse {
    valid: boolean;
    user: AuthUser;
}