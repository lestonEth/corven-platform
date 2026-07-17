// src/features/workspace/hooks/useWorkspaceFiles.ts
import {
    useCallback,
} from 'react';

import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { workspaceFilesApi } from '../api/workspace-files.api';
import { workspaceKeys } from '../queries/workspace.keys';

import type {
    CreateDirectoryInput,
    CreateFileInput,
    RenameFileInput,
    UpdateFileInput,
    WorkspaceFile,
} from '../types/workspace.types';

export function useWorkspaceFiles(
    workspaceId: string,
) {
    const queryClient = useQueryClient();

    const filesQuery = useQuery({
        queryKey: workspaceKeys.files(workspaceId),

        queryFn: () =>
            workspaceFilesApi.list(workspaceId),

        enabled: Boolean(workspaceId),
    });

    const invalidateFiles = useCallback(
        async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    workspaceKeys.files(workspaceId),
            });
        },
        [queryClient, workspaceId],
    );

    const createFileMutation = useMutation({
        mutationFn: (
            input: CreateFileInput,
        ) =>
            workspaceFilesApi.create(
                workspaceId,
                input,
            ),

        onSuccess: async (file) => {
            queryClient.setQueryData(
                workspaceKeys.file(
                    workspaceId,
                    file.path,
                ),
                file,
            );

            await invalidateFiles();
        },
    });

    const updateFileMutation = useMutation({
        mutationFn: (
            input: UpdateFileInput,
        ) =>
            workspaceFilesApi.update(
                workspaceId,
                input,
            ),

        onSuccess: (updatedFile) => {
            queryClient.setQueryData(
                workspaceKeys.file(
                    workspaceId,
                    updatedFile.path,
                ),
                updatedFile,
            );
        },
    });

    const deleteFileMutation = useMutation({
        mutationFn: (path: string) =>
            workspaceFilesApi.remove(
                workspaceId,
                path,
            ),

        onSuccess: async (_, deletedPath) => {
            queryClient.removeQueries({
                queryKey:
                    workspaceKeys.file(
                        workspaceId,
                        deletedPath,
                    ),
            });

            await invalidateFiles();
        },
    });

    const renameFileMutation = useMutation({
        mutationFn: (
            input: RenameFileInput,
        ) =>
            workspaceFilesApi.rename(
                workspaceId,
                input,
            ),

        onSuccess: async (
            _,
            input,
        ) => {
            queryClient.removeQueries({
                queryKey:
                    workspaceKeys.file(
                        workspaceId,
                        input.oldPath,
                    ),
            });

            await invalidateFiles();
        },
    });

    const createDirectoryMutation =
        useMutation({
            mutationFn: (
                input: CreateDirectoryInput,
            ) =>
                workspaceFilesApi.createDirectory(
                    workspaceId,
                    input,
                ),

            onSuccess: async () => {
                await invalidateFiles();
            },
        });

    const readFile = useCallback(
        async (
            path: string,
        ): Promise<WorkspaceFile> => {
            return queryClient.fetchQuery({
                queryKey:
                    workspaceKeys.file(
                        workspaceId,
                        path,
                    ),

                queryFn: () =>
                    workspaceFilesApi.read(
                        workspaceId,
                        path,
                    ),

                staleTime: 30_000,
            });
        },
        [queryClient, workspaceId],
    );

    return {
        entries: filesQuery.data ?? [],

        isLoading: filesQuery.isLoading,
        isRefreshing: filesQuery.isFetching,
        error: filesQuery.error,

        refreshFiles: filesQuery.refetch,

        readFile,

        createFile:
            createFileMutation.mutateAsync,

        updateFile:
            updateFileMutation.mutateAsync,

        deleteFile:
            deleteFileMutation.mutateAsync,

        renameFile:
            renameFileMutation.mutateAsync,

        createDirectory:
            createDirectoryMutation.mutateAsync,

        isCreating:
            createFileMutation.isPending,

        isSaving:
            updateFileMutation.isPending,

        isDeleting:
            deleteFileMutation.isPending,
    };
}