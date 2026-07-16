// src/features/node/hooks/useNodeState.ts
import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import { NodeState } from '../../../types';

const initialNodeState: NodeState = {
    status: 'Operational',
    version: 'v1.0.4-stable',
    uptime: '0d 00h 00m 00s',
    blockHeight: 0,
    syncProgress: 0,
    peers: [],
    blocks: [],
    metrics: {
        cpu: 0,
        memory: '0MB',
        network: 0,
        bandwidth: '0 Mbps',
    },
    logs: [],
};

export function useNodeState() {
    const [nodeState, setNodeState] =
        useState<NodeState>(initialNodeState);

    const [isLoading, setIsLoading] =
        useState(true);

    const fetchNodeState = useCallback(async () => {
        try {
            // This endpoint can be changed when the real
            // node-service API is implemented.
            const response = await fetch('/api/node');

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            if (data?.status) {
                setNodeState(data);
            }
        } catch (error) {
            console.error(
                'Failed to fetch node state:',
                error,
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchNodeState();

        const timer = window.setInterval(() => {
            void fetchNodeState();
        }, 3000);

        return () => {
            window.clearInterval(timer);
        };
    }, [fetchNodeState]);

    return {
        nodeState,
        isLoading,
        refreshNodeState: fetchNodeState,
    };
}