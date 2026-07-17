// src/features/workspace/queries/workspace.keys.ts

export const workspaceKeys = {
    all: ['workspaces'] as const,

    lists: () =>
        [...workspaceKeys.all, 'list'] as const,

    list: () =>
        [...workspaceKeys.lists()] as const,

    details: () =>
        [...workspaceKeys.all, 'detail'] as const,

    detail: (workspaceId: string) =>
        [
            ...workspaceKeys.details(),
            workspaceId,
        ] as const,

    files: (workspaceId: string) =>
        [
            ...workspaceKeys.detail(workspaceId),
            'files',
        ] as const,

    file: (
        workspaceId: string,
        path: string,
    ) =>
        [
            ...workspaceKeys.files(workspaceId),
            path,
        ] as const,

    status: (workspaceId: string) =>
        [
            ...workspaceKeys.detail(workspaceId),
            'status',
        ] as const,
};