// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import HomeView from '../components/HomeView';
import { useNodeState } from '../features/node/hooks/useNodeState';

export default function HomePage() {
    const navigate = useNavigate();
    const { nodeState } = useNodeState();

    return (
        <HomeView
            onStartBuilding={() =>
                navigate('/dashboard')
            }
            activeBlock={nodeState.blockHeight}
        />
    );
}