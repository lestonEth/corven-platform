import { useState, useEffect } from "react";
import {
    RefreshCw,
    RotateCcw,
    UserPlus,
    Layers,
    Network,
    Cpu,
    Activity,
    Link2Off,
    Download,
    Globe,
    Database,

} from "lucide-react";
import { NodeState, Block, Peer } from "../../../types";

interface NodesViewProps {
    nodeState: NodeState;
    onRestartNode: () => Promise<void>;
    onResetNode: () => Promise<void>;
    onConnectPeer: () => Promise<void>;
    onDisconnectPeer: (id: string) => Promise<void>;
}

export default function NodesView({
    nodeState,
    onRestartNode,
    onResetNode,
    onConnectPeer,
    onDisconnectPeer
}: NodesViewProps) {

    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
    const [isRestarting, setIsRestarting] = useState<boolean>(false);
    const [isResetting, setIsResetting] = useState<boolean>(false);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);

    // Restart Button Handler
    const handleRestart = async () => {
        if (isRestarting) {
            return;
        }

        setIsRestarting(true);

        try {
            await onRestartNode();
        } catch (error) {
            console.error('Failed to restart node:', error);
        } finally {
            setIsRestarting(false);
        }
    };

    const handleReset = async () => {
        if (isResetting) {
            return;
        }

        setIsResetting(true);

        try {
            await onResetNode();
            setSelectedBlock(null);
        } catch (error) {
            console.error('Failed to reset node:', error);
        } finally {
            setIsResetting(false);
        }
    };

    const handleConnectPeer = async () => {
        if (isConnecting) {
            return;
        }

        setIsConnecting(true);

        try {
            await onConnectPeer();
        } catch (error) {
            console.error('Failed to connect peer:', error);
        } finally {
            setIsConnecting(false);
        }
    };
    return (
        <div className="text-gray-100 min-h-screen bg-[#0d1117] p-8 pb-20 select-none">
            <div className="max-w-7xl mx-auto space-y-8 pt-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2 border-b border-[#30363d]/40">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-xs text-[#58a6ff] bg-[#1f6feb]/15 px-2.5 py-0.5 rounded border border-[#1f6feb]/30 font-bold">
                                NODE-01
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <span className={`w-2 h-2 rounded-full ${nodeState.status === 'Operational' ? 'bg-emerald-500 animate-pulse' :
                                    nodeState.status === 'Restarting' ? 'bg-amber-400 animate-spin' : 'bg-sky-400 animate-pulse'
                                    }`} />
                                <span className="capitalize">{nodeState.status}</span>
                            </div>
                        </div>
                        <h1 className="font-headline-md text-3xl font-extrabold text-white">Node Manager</h1>
                    </div>

                    {/* Action buttons list */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleRestart}
                            disabled={isRestarting || nodeState.status !== "Operational"}
                            className="flex items-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded font-mono text-xs text-gray-300 hover:border-[#1f6feb] hover:text-[#58a6ff] transition-all disabled:opacity-40 cursor-pointer"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${isRestarting ? 'animate-spin' : ''}`} />
                            <span>{isRestarting ? "Restarting..." : "Restart Node"}</span>
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={isResetting || nodeState.status !== "Operational"}
                            className="flex items-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded font-mono text-xs text-gray-300 hover:border-rose-500 hover:text-rose-400 transition-all disabled:opacity-40 cursor-pointer"
                        >
                            <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                            <span>{isResetting ? "Purging database..." : "Reset Node"}</span>
                        </button>
                        <button
                            onClick={handleConnectPeer}
                            disabled={isConnecting}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded font-mono text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#1f6feb]/15"
                        >
                            <UserPlus className="h-3.5 w-3.5" />
                            <span>{isConnecting ? "Adding peer..." : "Connect Peer"}</span>
                        </button>
                    </div>
                </div>

                {/* Bento Grid Nodes Dashboard */}
                <div className="grid grid-cols-12 gap-6">

                    {/* Node Health metrics summary card - Span 4 */}
                    <div className="col-span-12 lg:col-span-4 bg-[#161b22]/70 border border-[#30363d] p-6 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-6">
                            <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                                <Layers className="h-4 w-4 text-[#58a6ff]" /> Node Health Stats
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3.5 bg-[#0d1117] rounded-xl border border-[#30363d]/40">
                                    <span className="text-xs text-gray-400 font-mono">P2P Core Version</span>
                                    <span className="font-mono text-xs text-[#58a6ff] font-bold">{nodeState.version}</span>
                                </div>
                                <div className="flex justify-between items-center p-3.5 bg-[#0d1117] rounded-xl border border-[#30363d]/40">
                                    <span className="text-xs text-gray-400 font-mono">Active Connected Peers</span>
                                    <span className="font-headline-sm text-lg text-white font-black">{nodeState.peers.length} Nodes</span>
                                </div>
                                <div className="flex justify-between items-center p-3.5 bg-[#0d1117] rounded-xl border border-[#30363d]/40">
                                    <span className="text-xs text-gray-400 font-mono">Session Uptime</span>
                                    <span className="font-mono text-xs text-gray-200">{nodeState.uptime}</span>
                                </div>
                                <div className="flex justify-between items-center p-3.5 bg-[#0d1117] rounded-xl border border-[#30363d]/40">
                                    <span className="text-xs text-gray-400 font-mono">Synchronization Progress</span>
                                    <div className="flex items-center gap-3 w-1/2 justify-end">
                                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                style={{ width: `${nodeState.syncProgress}%` }}
                                            />
                                        </div>
                                        <span className="font-mono text-xs font-bold text-gray-300">{nodeState.syncProgress}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Metrics Fluctuations */}
                        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-[#30363d]/40 text-xs font-mono text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <Cpu className="h-3.5 w-3.5 text-[#1f6feb]" />
                                <span>CPU: <span className="text-white font-bold">{nodeState.metrics.cpu}%</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Activity className="h-3.5 w-3.5 text-[#ff7b72]" />
                                <span>Net BW: <span className="text-white font-bold">{nodeState.metrics.bandwidth}</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Network Topology animated SVG graph - Span 8 */}
                    <div className="col-span-12 lg:col-span-8 bg-[#161b22]/70 border border-[#30363d] p-6 rounded-2xl relative overflow-hidden flex flex-col h-[360px]">
                        {/* Animated grid background */}
                        <div className="absolute inset-0 bg-[radial-gradient(#30363d_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

                        <div className="flex justify-between items-center mb-4 z-10">
                            <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                                <Network className="h-4 w-4 text-[#a5d6ff]" /> P2P Network Topology
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 bg-[#0d1117] px-3 py-1 rounded-full border border-[#30363d]/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active Peer Mesh Tunnel
                            </div>
                        </div>

                        {/* SVG Interactive Topology mapping */}
                        <div className="flex-1 flex items-center justify-center relative z-10">
                            <svg className="w-full h-full max-h-[260px] max-w-md" viewBox="0 0 400 240">
                                {/* Center Node01 */}
                                <circle cx="200" cy="120" r="16" fill="#1f6feb" fillOpacity="0.15" stroke="#1f6feb" strokeWidth="2" />
                                <circle cx="200" cy="120" r="6" fill="#1f6feb" />

                                {/* Peer orbits */}
                                {nodeState.peers.map((peer, idx) => {
                                    const angle = (idx * 2 * Math.PI) / nodeState.peers.length + (Date.now() / 35000);
                                    const radius = 75;
                                    const cx = 200 + radius * Math.cos(angle);
                                    const cy = 120 + radius * Math.sin(angle);

                                    return (
                                        <g key={peer.id} className="group cursor-pointer">
                                            {/* Connection Line */}
                                            <line
                                                x1="200" y1="120" x2={cx} y2={cy}
                                                stroke="#1f6feb" strokeOpacity="0.2" strokeWidth="1"
                                                strokeDasharray="4,4"
                                            />

                                            {/* Peer Node dot */}
                                            <circle
                                                cx={cx} cy={cy} r="10"
                                                fill={peer.latency < 25 ? "#10b981" : "#1f6feb"}
                                                fillOpacity="0.15"
                                                stroke={peer.latency < 25 ? "#10b981" : "#1f6feb"}
                                                strokeWidth="1.5"
                                            />
                                            <circle cx={cx} cy={cy} r="3.5" fill={peer.latency < 25 ? "#10b981" : "#1f6feb"} />

                                            {/* Hover label */}
                                            <text
                                                x={cx} y={cy - 12}
                                                fill="#58a6ff"
                                                fontSize="8"
                                                fontFamily="monospace"
                                                textAnchor="middle"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#0d1117] px-1 py-0.5"
                                            >
                                                {peer.id} ({peer.latency}ms)
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>

                            <div className="absolute bottom-1 right-2 bg-[#0d1117]/80 px-3 py-1.5 rounded-lg border border-[#30363d]/50 text-[10px] font-mono text-gray-400">
                                Mesh Scale: {nodeState.peers.length} active peers | Propagation: 12ms
                            </div>
                        </div>
                    </div>

                    {/* Latest blocks column - Span 4 */}
                    <div className="col-span-12 lg:col-span-4 bg-[#161b22]/70 border border-[#30363d] p-5 rounded-2xl flex flex-col h-[400px]">
                        <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-bold mb-4">
                            <Database className="h-4 w-4 text-[#ff7b72]" /> Latest Mined Blocks
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                            {nodeState.blocks.map((blk) => (
                                <div
                                    key={blk.number}
                                    onClick={() => setSelectedBlock(selectedBlock?.number === blk.number ? null : blk)}
                                    className={`p-3 bg-[#0d1117]/90 rounded-xl border-l-4 transition-all cursor-pointer hover:bg-[#1f2631] ${blk.txCount > 0 ? 'border-emerald-500' : 'border-[#1f6feb]'
                                        } ${selectedBlock?.number === blk.number ? 'bg-[#161b22] border-l-amber-400' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-xs font-bold text-white"># {blk.number}</span>
                                        <span className="text-[10px] text-gray-500 font-mono">
                                            {blk.txCount === 1 ? '1 transaction' : `${blk.txCount} transactions`}
                                        </span>
                                    </div>
                                    <div className="font-mono text-[10px] text-gray-400 truncate mt-1">
                                        {blk.hash}
                                    </div>

                                    {/* Expanded block detail drawer */}
                                    {selectedBlock?.number === blk.number && (
                                        <div className="mt-3 pt-3 border-t border-gray-800 text-[10px] font-mono text-gray-400 space-y-1 select-text">
                                            <div>Size: <span className="text-white">{blk.size}</span></div>
                                            <div>Gas Used: <span className="text-white">{blk.gasUsed}</span></div>
                                            {blk.transactions.length > 0 && (
                                                <div className="mt-1.5 space-y-1">
                                                    <div className="text-[#58a6ff] font-bold">TX LIST:</div>
                                                    {blk.transactions.map((tx, idx) => (
                                                        <div key={idx} className="bg-[#0d1117] p-1 rounded border border-gray-800/30 truncate">
                                                            {tx}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Node streaming logs terminal - Span 8 */}
                    <div className="col-span-12 lg:col-span-8 bg-[#161b22]/70 border border-[#30363d] rounded-2xl overflow-hidden flex flex-col h-[400px]">
                        <div className="bg-[#0d1117] px-5 py-3 flex justify-between items-center border-b border-[#30363d]">
                            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-gray-400">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/20" />
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/20" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                                <span className="ml-1 text-gray-300">node-logs --tail 100</span>
                            </div>
                            <div className="flex gap-3 text-gray-500">
                                <button title="Download logs" className="hover:text-[#58a6ff]">
                                    <Download className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-[#0d1117] p-5 font-mono text-[11px] text-[#10b981] overflow-y-auto scrollbar-thin leading-relaxed select-text">
                            {nodeState.logs.map((logLine, idx) => (
                                <div key={idx} className="mb-1">{logLine}</div>
                            ))}
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className="w-1.5 h-3.5 bg-[#10b981] animate-pulse" />
                                <span className="text-gray-500 font-bold">_</span>
                            </div>
                        </div>
                    </div>

                    {/* Connected P2P Peer details table list - Span 12 */}
                    <div className="col-span-12 bg-[#161b22]/70 border border-[#30363d] p-6 rounded-2xl overflow-hidden mb-10">
                        <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-bold mb-5">
                            <Globe className="h-4 w-4 text-[#58a6ff]" /> Connected Peer Mesh Details
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse select-text">
                                <thead>
                                    <tr className="border-b border-[#30363d] text-[11px] font-mono uppercase text-gray-500 font-bold tracking-wider">
                                        <th className="pb-3 pr-4">Peer ID</th>
                                        <th className="pb-3 px-4">Address</th>
                                        <th className="pb-3 px-4">Latency</th>
                                        <th className="pb-3 px-4">Region</th>
                                        <th className="pb-3 px-4">Client</th>
                                        <th className="pb-3 pl-4 text-right">Disconnect</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs text-gray-300 divide-y divide-[#30363d]/40 font-mono">
                                    {nodeState.peers.map((peer) => (
                                        <tr key={peer.id} className="hover:bg-[#111827]/40 transition-colors">
                                            <td className="py-3.5 pr-4 font-bold text-[#58a6ff]">{peer.id}</td>
                                            <td className="py-3.5 px-4 text-gray-400">{peer.address}</td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${peer.latency < 25 ? 'bg-emerald-500/10 text-emerald-400' :
                                                    peer.latency < 60 ? 'bg-[#1f6feb]/10 text-[#58a6ff]' :
                                                        'bg-amber-400/10 text-amber-400'
                                                    }`}>
                                                    {peer.latency} ms
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-400">{peer.region}</td>
                                            <td className="py-3.5 px-4 text-gray-500">{peer.client}</td>
                                            <td className="py-3.5 pl-4 text-right">
                                                <button
                                                    onClick={() => onDisconnectPeer(peer.id)}
                                                    title="Disconnect Peer Socket"
                                                    className="text-gray-500 hover:text-rose-500 p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Link2Off className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {nodeState.peers.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                                                No connected peers. Click "Connect Peer" to expand P2P topology mesh!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
