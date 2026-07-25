// src/features/auth/context/AuthContext.tsx

import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { authApi } from '../api/auth.api';

import {
    AuthUser,
    LoginInput,
    RegisterInput,
    WalletLoginInput,
} from '../types/auth.types';

import { tokenStorage } from '../../../lib/token-storage';

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isInitializing: boolean;

    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    walletLogin: (input: WalletLoginInput) => Promise<void>;

    logout: () => void;
    refreshUser: () => Promise<void>;
}

export const AuthContext =
    createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isInitializing, setIsInitializing] =
        useState(true);

    const refreshUser = useCallback(async () => {
        const token = tokenStorage.get();

        if (!token) {
            setUser(null);
            return;
        }

        try {
            const currentUser =
                await authApi.getCurrentUser();

            setUser(currentUser);
        } catch {
            tokenStorage.remove();
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await refreshUser();
            } finally {
                setIsInitializing(false);
            }
        };

        void initializeAuth();
    }, [refreshUser]);

    const login = useCallback(
        async (input: LoginInput) => {
            const response = await authApi.login(input);

            tokenStorage.set(response.accessToken);
            setUser(response.user);
        },
        [],
    );

    const register = useCallback(
        async (input: RegisterInput) => {
            const response = await authApi.register(input);

            tokenStorage.set(response.accessToken);
            setUser(response.user);
        },
        [],
    );

    const walletLogin = useCallback(
        async (input: WalletLoginInput) => {
            const response =
                await authApi.walletLogin(input);

            tokenStorage.set(response.accessToken);
            setUser(response.user);
        },
        [],
    );

    const logout = useCallback(() => {
        tokenStorage.remove();
        setUser(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            isInitializing,
            login,
            register,
            walletLogin,
            logout,
            refreshUser,
        }),
        [
            user,
            isInitializing,
            login,
            register,
            walletLogin,
            logout,
            refreshUser,
        ],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}