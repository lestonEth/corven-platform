// src/app/providers.tsx
import { ReactNode } from 'react';
import { AuthProvider } from '../features/auth/context/AuthContext';

interface AppProvidersProps {
    children: ReactNode;
}

export default function AppProviders({
    children,
}: AppProvidersProps) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}