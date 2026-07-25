// src/features/workspace/api/workspace.api.ts
import { apiClient } from '../../../lib/api-client';
import type {
    Workspace,
} from '../types/workspace.types';

export interface CreateWorkspaceInput {
    name: string;
    templateId?: string;
}

export const workspaceApi = {
    list(): Promise<Workspace[]> {
        return apiClient<Workspace[]>(
            '/workspaces',
        );
    },

    get(
        workspaceId: string,
    ): Promise<Workspace> {
        return apiClient<Workspace>(
            `/workspaces/${workspaceId}`,
        );
    },

    create(
        input: CreateWorkspaceInput,
    ): Promise<Workspace> {
        return apiClient<Workspace>(
            '/workspaces',
            {
                method: 'POST',
                body: JSON.stringify(input),
            },
        );
    },

    start(workspaceId: string) {
        return apiClient(
            `/workspaces/${workspaceId}/start`,
            {
                method: 'POST',
            },
        );
    },

    stop(workspaceId: string) {
        return apiClient(
            `/workspaces/${workspaceId}/stop`,
            {
                method: 'POST',
            },
        );
    },

    status(workspaceId: string) {
        return apiClient(
            `/workspaces/${workspaceId}/status`,
        );
    },

    remove(workspaceId: string) {
        return apiClient(
            `/workspaces/${workspaceId}`,
            {
                method: 'DELETE',
            },
        );
    },
};