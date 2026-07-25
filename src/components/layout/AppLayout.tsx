// src/components/layout/AppLayout.tsx
import { useState } from 'react';
import {
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom';

import Header from '../Header';
import Sidebar from '../Sidebar';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useNodeState } from '../../features/node/hooks/useNodeState';

export type AppView =
    | 'home'
    | 'dashboard'
    | 'ide'
    | 'nodes';

function pathToView(pathname: string): AppView {
    if (pathname.startsWith('/dashboard')) {
        return 'dashboard';
    }

    if (pathname.startsWith('/ide')) {
        return 'ide';
    }

    if (pathname.startsWith('/nodes')) {
        return 'nodes';
    }

    return 'home';
}

function viewToPath(view: AppView): string {
    const paths: Record<AppView, string> = {
        home: '/',
        dashboard: '/dashboard',
        ide: '/ide',
        nodes: '/nodes',
    };

    return paths[view];
}

export default function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const { user, logout } = useAuth();
    const { nodeState } = useNodeState();

    const [activeIdeTab, setActiveIdeTab] =
        useState('files');

    const activeView = pathToView(location.pathname);

    const setActiveView = (view: AppView) => {
        navigate(viewToPath(view));
    };

    return (
        <div className="bg-[#0d1117] text-gray-200 min-h-screen relative font-sans flex flex-col antialiased">
            <Header
                activeView={activeView}
                setActiveView={setActiveView}
                nodeStatus={nodeState.status}
                onDeploy={() => undefined}
                isDeploying={false}
                user={user as any}
                onLogout={() => {
                    logout();
                    navigate('/auth', {
                        replace: true,
                    });
                }}
            />

            <div className="flex flex-1 pt-14 overflow-hidden h-[calc(100vh-3.5rem)]">
                <Sidebar
                    activeView={activeView}
                    setActiveView={setActiveView}
                    activeIdeTab={activeIdeTab}
                    setActiveIdeTab={setActiveIdeTab}
                />

                <main className="flex-1 ml-16 overflow-y-auto bg-[#0d1117] pb-8">
                    <Outlet
                        context={{
                            activeIdeTab,
                            setActiveIdeTab,
                        }}
                    />
                </main>
            </div>

            <footer className="bg-[#0d1117] border-t border-[#30363d] flex justify-between items-center px-6 h-8 fixed bottom-0 left-0 right-0 z-50 text-[11px] font-mono select-none text-gray-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Stable corven Sandbox
                    </span>

                    <span>|</span>

                    <span>
                        Uptime: {nodeState.uptime}
                    </span>
                </div>

                <div className="flex gap-6">
                    <a href="#" className="hover:text-[#58a6ff]">
                        Documentation
                    </a>

                    <a href="#" className="hover:text-[#58a6ff]">
                        Changelog
                    </a>

                    <a href="#" className="hover:text-[#58a6ff]">
                        Privacy
                    </a>
                </div>
            </footer>
        </div>
    );
}