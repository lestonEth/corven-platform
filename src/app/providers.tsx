// src/app/providers.tsx
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '../lib/query-client';
import { AuthProvider } from '../features/auth/context/AuthContext';

interface AppProvidersProps {
    children: ReactNode;
}

export default function AppProviders({
    children,
}: AppProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>

        </QueryClientProvider>
    );
}