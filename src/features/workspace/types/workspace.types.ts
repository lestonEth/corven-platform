// src/features/workspace/types/workspace.types.ts

export type WorkspaceStatus =
    | 'PENDING'
    | 'PROVISIONING'
    | 'RUNNING'
    | 'IDLE'
    | 'STOPPED'
    | 'FAILED'
    | 'DELETED';

export interface Workspace {
    id: string;
    name: string;
    status: WorkspaceStatus;
    userId: string;
    templateId: string | null;
    runtimeNetwork: string | null;
    runtimeVolume: string | null;
    lastStartedAt: string | null;
    lastStoppedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export type WorkspaceEntryType =
    | 'file'
    | 'directory';

export interface WorkspaceEntry {
    name: string;
    path: string;
    type: WorkspaceEntryType;
    size?: number;
}

export interface WorkspaceFile
    extends WorkspaceEntry {
    type: 'file';
    content: string;
}

export interface CreateFileInput {
    path: string;
    content?: string;
}

export interface UpdateFileInput {
    path: string;
    content: string;
}

export interface RenameFileInput {
    oldPath: string;
    newPath: string;
}

export interface CreateDirectoryInput {
    path: string;
}

export type IdePanel =
    | 'files'
    | 'search'
    | 'git'
    | 'debug';

export type BottomPanelType =
    | 'terminal'
    | 'debug'
    | 'output'
    | 'problems';