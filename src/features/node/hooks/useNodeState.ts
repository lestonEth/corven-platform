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

interface NodeActionResponse {
    success?: boolean;
    message?: string;
    nodeState?: NodeState;
}

export function useNodeState() {
    const [nodeState, setNodeState] =
        useState<NodeState>(initialNodeState);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const request = useCallback(
        async <T,>(
            url: string,
            options?: RequestInit,
        ): Promise<T> => {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });

            if (!response.ok) {
                const data = await response
                    .json()
                    .catch(() => null);

                throw new Error(
                    data?.message ??
                    `Request failed with status ${response.status}`,
                );
            }

            return response.json();
        },
        [],
    );

    const fetchNodeState = useCallback(async () => {
        try {
            setError(null);

            const data = await request<NodeState>(
                '/api/node',
            );

            if (data?.status) {
                setNodeState(data);
            }
        } catch (requestError) {
            const message =
                requestError instanceof Error
                    ? requestError.message
                    : 'Failed to fetch node state';

            setError(message);

            console.error(
                'Failed to fetch node state:',
                requestError,
            );
        } finally {
            setIsLoading(false);
        }
    }, [request]);

    const restartNode = useCallback(async () => {
        setNodeState((current) => ({
            ...current,
            status: 'Restarting',
        }));

        try {
            setError(null);

            const result =
                await request<NodeActionResponse>(
                    '/api/node/restart',
                    {
                        method: 'POST',
                    },
                );

            if (result.nodeState) {
                setNodeState(result.nodeState);
            } else {
                await fetchNodeState();
            }
        } catch (requestError) {
            setNodeState((current) => ({
                ...current,
                status: 'Operational',
            }));

            throw requestError;
        }
    }, [fetchNodeState, request]);

    const resetNode = useCallback(async () => {
        try {
            setError(null);

            const result =
                await request<NodeActionResponse>(
                    '/api/node/reset',
                    {
                        method: 'POST',
                    },
                );

            if (result.nodeState) {
                setNodeState(result.nodeState);
            } else {
                await fetchNodeState();
            }
        } catch (requestError) {
            const message =
                requestError instanceof Error
                    ? requestError.message
                    : 'Failed to reset node';

            setError(message);
            throw requestError;
        }
    }, [fetchNodeState, request]);

    const connectPeer = useCallback(async () => {
        try {
            setError(null);

            const result =
                await request<NodeActionResponse>(
                    '/api/node/peers',
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            address: null,
                        }),
                    },
                );

            if (result.nodeState) {
                setNodeState(result.nodeState);
            } else {
                await fetchNodeState();
            }
        } catch (requestError) {
            const message =
                requestError instanceof Error
                    ? requestError.message
                    : 'Failed to connect peer';

            setError(message);
            throw requestError;
        }
    }, [fetchNodeState, request]);

    const disconnectPeer = useCallback(
        async (peerId: string) => {
            try {
                setError(null);

                await request<NodeActionResponse>(
                    `/api/node/peers/${encodeURIComponent(peerId)}`,
                    {
                        method: 'DELETE',
                    },
                );

                setNodeState((current) => ({
                    ...current,
                    peers: current.peers.filter(
                        (peer) => peer.id !== peerId,
                    ),
                }));
            } catch (requestError) {
                const message =
                    requestError instanceof Error
                        ? requestError.message
                        : 'Failed to disconnect peer';

                setError(message);
                throw requestError;
            }
        },
        [request],
    );

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
        error,
        refreshNodeState: fetchNodeState,
        restartNode,
        resetNode,
        connectPeer,
        disconnectPeer,
    };
}