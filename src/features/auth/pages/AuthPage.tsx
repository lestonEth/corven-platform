// src/features/auth/pages/AuthPage.tsx

import {
    Navigate,
    useLocation,
    useNavigate,
} from 'react-router-dom';

import AuthView from '../../../components/AuthView';
import { useAuth } from '../hooks/useAuth';

interface LocationState {
    from?: {
        pathname?: string;
    };
}

export default function AuthPage() {
    const {
        walletLogin,
        isAuthenticated,
        isInitializing,
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const state =
        location.state as LocationState | null;

    const destination =
        state?.from?.pathname || '/dashboard';

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <Navigate
                to={destination}
                replace
            />
        );
    }

    return (
        <AuthView
            onAuthenticated={() => {
                navigate(destination, {
                    replace: true,
                });
            }}
        />
    );
}