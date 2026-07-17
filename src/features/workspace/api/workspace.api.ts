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
            '/workspace',
        );
    },

    get(
        workspaceId: string,
    ): Promise<Workspace> {
        return apiClient<Workspace>(
            `/workspace/${workspaceId}`,
        );
    },

    create(
        input: CreateWorkspaceInput,
    ): Promise<Workspace> {
        return apiClient<Workspace>(
            '/workspace',
            {
                method: 'POST',
                body: JSON.stringify(input),
            },
        );
    },

    start(workspaceId: string) {
        return apiClient(
            `/workspace/${workspaceId}/start`,
            {
                method: 'POST',
            },
        );
    },

    stop(workspaceId: string) {
        return apiClient(
            `/workspace/${workspaceId}/stop`,
            {
                method: 'POST',
            },
        );
    },

    status(workspaceId: string) {
        return apiClient(
            `/workspace/${workspaceId}/status`,
        );
    },

    remove(workspaceId: string) {
        return apiClient(
            `/workspace/${workspaceId}`,
            {
                method: 'DELETE',
            },
        );
    },
};