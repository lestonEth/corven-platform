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
        login,
        register,
        isAuthenticated,
        isInitializing,
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as LocationState | null;

    const destination =
        state?.from?.pathname || '/dashboard';

    if (isInitializing) {
        return null;
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
            onLogin={async (email, password) => {
                await login({
                    email,
                    password,
                });

                navigate(destination, {
                    replace: true,
                });
            }}
            onRegister={async (
                name,
                email,
                password,
            ) => {
                await register({
                    name,
                    email,
                    password,
                });

                navigate(destination, {
                    replace: true,
                });
            }}
        />
    );
}