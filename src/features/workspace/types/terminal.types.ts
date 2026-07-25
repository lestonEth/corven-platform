export type TerminalConnectionStatus =
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'error';

export interface CreateTerminalPayload {
    workspaceId: string;
    cols: number;
    rows: number;
}

export interface CreateTerminalResponse {
    success: boolean;
    sessionId?: string;
    message?: string;
}

export interface TerminalInputPayload {
    workspaceId: string;
    sessionId: string;
    data: string;
}

export interface TerminalResizePayload {
    workspaceId: string;
    sessionId: string;
    cols: number;
    rows: number;
}

export interface TerminalClosedPayload {
    workspaceId: string;
    success?: boolean;
}

export interface TerminalOutputPayload {
    workspaceId?: string;
    sessionId: string;
    data: string;
}

export interface TerminalReadyPayload {
    workspaceId: string;
    execId: string; // Backend sends execId
    sessionId?: string; // Optional for compatibility
}

export type TerminalExitPayload = {
    exitCode?: number;
    signal?: string;
};

export interface TerminalErrorPayload {
    workspaceId?: string;
    sessionId?: string;
    message: string;
}