import NodesView from '../features/node/components/NodesView';
import { useNodeState } from '../features/node/hooks/useNodeState';

export default function NodesPage() {
    const {
        nodeState,
        isLoading,
        error,
        restartNode,
        resetNode,
        connectPeer,
        disconnectPeer,
    } = useNodeState();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0d1117] text-gray-300">
                <div className="font-mono text-sm">
                    Loading node state...
                </div>
            </div>
        );
    }

    return (
        <>
            {error && (
                <div className="fixed right-4 top-4 z-50 max-w-md rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300">
                    {error}
                </div>
            )}

            <NodesView
                nodeState={nodeState}
                onRestartNode={restartNode}
                onResetNode={resetNode}
                onConnectPeer={connectPeer}
                onDisconnectPeer={disconnectPeer}
            />
        </>
    );
}