// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from '../components/auth/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

import AuthPage from '../features/auth/pages/AuthPage';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import IdePage from '../pages/IdePage';
// import NodesPage from '../pages/NodesPage';
// import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthPage />,
    },

    {
        element: <ProtectedRoute />,

        children: [
            {
                element: <AppLayout />,

                children: [
                    {
                        path: '/',
                        element: <HomePage />,
                    },
                    {
                        path: '/dashboard',
                        element: <DashboardPage />,
                    },
                    {
                        path: '/ide',
                        element: <IdePage />,
                    },
                    {
                        path: '/ide/:workspaceId',
                        element: <IdePage />,
                    }
                    // {
                    //     path: '/nodes',
                    //     element: <NodesPage />,
                    // },
                ],
            },
        ],
    },

    // {
    //     path: '*',
    //     element: <NotFoundPage />,
    // },
]);