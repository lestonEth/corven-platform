// src/features/workspace/api/workspace-files.api.ts
import { apiClient } from '../../../lib/api-client';

import type {
    CreateDirectoryInput,
    CreateFileInput,
    RenameFileInput,
    UpdateFileInput,
    WorkspaceEntry,
    WorkspaceFile,
} from '../types/workspace.types';

export const workspaceFilesApi = {
    list(
        workspaceId: string,
    ): Promise<WorkspaceEntry[]> {
        return apiClient<WorkspaceEntry[]>(
            `/workspaces/${workspaceId}/files`,
        );
    },

    read(
        workspaceId: string,
        path: string,
    ): Promise<WorkspaceFile> {
        const params = new URLSearchParams({
            path,
        });

        return apiClient<WorkspaceFile>(
            `/workspaces/${workspaceId}/files/content?${params.toString()}`,
        );
    },

    create(
        workspaceId: string,
        input: CreateFileInput,
    ): Promise<WorkspaceFile> {
        return apiClient<WorkspaceFile>(
            `/workspaces/${workspaceId}/files`,
            {
                method: 'POST',
                body: JSON.stringify({
                    path: input.path,
                    content: input.content ?? '',
                }),
            },
        );
    },

    update(
        workspaceId: string,
        input: UpdateFileInput,
    ): Promise<WorkspaceFile> {
        return apiClient<WorkspaceFile>(
            `/workspaces/${workspaceId}/files`,
            {
                method: 'PUT',
                body: JSON.stringify(input),
            },
        );
    },

    remove(
        workspaceId: string,
        path: string,
    ): Promise<{
        success: boolean;
        path: string;
    }> {
        const params = new URLSearchParams({
            path,
        });

        return apiClient(
            `/workspaces/${workspaceId}/files?${params.toString()}`,
            {
                method: 'DELETE',
            },
        );
    },

    rename(
        workspaceId: string,
        input: RenameFileInput,
    ) {
        return apiClient(
            `/workspaces/${workspaceId}/files/rename`,
            {
                method: 'PUT',
                body: JSON.stringify(input),
            },
        );
    },

    createDirectory(
        workspaceId: string,
        input: CreateDirectoryInput,
    ): Promise<WorkspaceEntry> {
        return apiClient<WorkspaceEntry>(
            `/workspaces/${workspaceId}/directories`,
            {
                method: 'POST',
                body: JSON.stringify(input),
            },
        );
    },
};
