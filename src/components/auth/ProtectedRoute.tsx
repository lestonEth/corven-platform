// src/components/auth/ProtectedRoute.tsx
import {
    Navigate,
    Outlet,
    useLocation,
} from 'react-router-dom';

import { useAuth } from '../../features/auth/hooks/useAuth';
import LoadingScreen from '../common/LoadingScreen';

export default function ProtectedRoute() {
    const {
        isAuthenticated,
        isInitializing,
    } = useAuth();

    const location = useLocation();

    if (isInitializing) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/auth"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}