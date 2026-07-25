// src/features/workspace/types/build.types.ts
export interface BuildEntry {
    status: 'idle' | 'running' | 'success' | 'error' | 'cancelled';
    output: string;
    error?: string | null;
    timestamp?: string;
    durationMs?: number;
}

export interface BuildStartedEvent {
    workspaceId: string;
    buildId: string;
    target: string;
    startedAt: string;
}

export interface BuildOutputEvent {
    workspaceId: string;
    buildId: string;
    stream: 'stdout' | 'stderr';
    data: string;
}

export interface BuildFinishedEvent {
    workspaceId: string;
    buildId: string;
    exitCode: number;
    status: 'success' | 'error';
    error: string | null;
    output: string;
    durationMs: number;
    finishedAt: string;
}

export interface BuildErrorEvent {
    workspaceId: string;
    buildId?: string;
    message: string;
}

export interface BuildCancelledEvent {
    workspaceId: string;
    buildId: string;
}