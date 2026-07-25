// src/app/providers.tsx
import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '../lib/query-client';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { ccc } from '@ckb-ccc/connector-react';

interface AppProvidersProps {
    children: ReactNode;
}

export default function AppProviders({
    children,
}: AppProvidersProps) {

    const connectorStyles = {
        '--background': '#161b22',
        '--divider': 'rgba(255, 255, 255, 0.1)',
        '--btn-primary': '#21262d',
        '--btn-primary-hover': '#21262d',
        '--btn-secondary': '#21262d',
        '--btn-secondary-hover': '#30363d',
        '--icon-primary': '#ffffff',
        '--icon-secondary': 'rgba(255, 255, 255, 0.6)',
        '--tip-color': '#8b949e',
        color: '#ffffff',
    } as CSSProperties;

    const defaultClient = useMemo(
        () => new ccc.ClientPublicTestnet(),
        [],
    );

    const clientOptions = useMemo(
        () => [
            {
                name: 'CKB Testnet',
                client: new ccc.ClientPublicTestnet(),
            },
            {
                name: 'CKB Mainnet',
                client: new ccc.ClientPublicMainnet(),
            },
        ],
        [],
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ccc.Provider
                    defaultClient={defaultClient}
                    clientOptions={clientOptions}
                    connectorProps={{
                        style: connectorStyles,
                    }}
                >
                    {children}
                </ccc.Provider>
            </AuthProvider>

        </QueryClientProvider>
    );
}