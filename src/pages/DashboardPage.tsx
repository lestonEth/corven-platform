// src/pages/DashboardPage.tsx
import { useNavigate } from 'react-router-dom';

import DashboardView from '../features/dashboard/components/DashboardView';
import { useNodeState } from '../features/node/hooks/useNodeState';
import { useWorkspaces } from '../features/dashboard/hooks/useWorkspaces';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { nodeState } = useNodeState();

    const {
        workspaces,
        isLoading: isLoadingWorkspaces,
        startWorkspace,
        stopWorkspace,
        startingWorkspaceId,
        stoppingWorkspaceId,
        removeWorkspace,
        removingWorkspaceId,
    } = useWorkspaces();

    return (
        <DashboardView
            metrics={nodeState.metrics}
            nodeStatus={nodeState.status}
            workspaces={workspaces}
            isLoadingWorkspaces={isLoadingWorkspaces}
            startingWorkspaceId={startingWorkspaceId}
            stoppingWorkspaceId={stoppingWorkspaceId}
            removingWorkspaceId={removingWorkspaceId}
            onStartWorkspace={(workspaceId) => {
                void startWorkspace(workspaceId);
            }}
            onStopWorkspace={(workspaceId) => {
                void stopWorkspace(workspaceId);
            }}
            onNavigateToIde={(workspaceId) =>
                navigate(
                    workspaceId
                        ? `/ide/${workspaceId}`
                        : '/ide',
                )
            }
            onNavigateToNodes={() => navigate('/nodes')}
            onRemoveWorkspace={(workspaceId) => {
                void removeWorkspace(workspaceId);
            }}
        />
    );
}