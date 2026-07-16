// src/pages/DashboardPage.tsx
import { useNavigate } from 'react-router-dom';
import DashboardView from '../components/DashboardView';
import { useNodeState } from '../features/node/hooks/useNodeState';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { nodeState } = useNodeState();

    return (
        <DashboardView
            metrics={nodeState.metrics}
            nodeStatus={nodeState.status}
            onNavigateToIde={() => navigate('/ide')}
            onNavigateToNodes={() => navigate('/nodes')}
            deployTriggeredCount={0}
        />
    );
}