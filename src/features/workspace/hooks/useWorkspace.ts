// src/features/workspace/hooks/useWorkspace.ts
import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { workspaceApi } from '../api/workspace.api';
import { workspaceKeys } from '../queries/workspace.keys';

export function useWorkspace(
    workspaceId: string,
) {
    const queryClient = useQueryClient();

    const workspaceQuery = useQuery({
        queryKey:
            workspaceKeys.detail(workspaceId),

        queryFn: () =>
            workspaceApi.get(workspaceId),

        enabled: Boolean(workspaceId),
    });

    const statusQuery = useQuery({
        queryKey:
            workspaceKeys.status(workspaceId),

        queryFn: () =>
            workspaceApi.status(workspaceId),

        enabled: Boolean(workspaceId),

        refetchInterval: (query) => {
            const data = query.state.data as
                | {
                    workspace?: {
                        status?: string;
                    };
                }
                | undefined;

            return data?.workspace?.status ===
                'PROVISIONING'
                ? 2_000
                : false;
        },
    });

    const startMutation = useMutation({
        mutationFn: () =>
            workspaceApi.start(workspaceId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    workspaceKeys.detail(workspaceId),
            });

            await queryClient.invalidateQueries({
                queryKey:
                    workspaceKeys.status(workspaceId),
            });
        },
    });

    const stopMutation = useMutation({
        mutationFn: () =>
            workspaceApi.stop(workspaceId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    workspaceKeys.detail(workspaceId),
            });

            await queryClient.invalidateQueries({
                queryKey:
                    workspaceKeys.status(workspaceId),
            });
        },
    });

    return {
        workspace:
            workspaceQuery.data ?? null,

        runtimeStatus:
            statusQuery.data ?? null,

        isLoading:
            workspaceQuery.isLoading,

        error:
            workspaceQuery.error,

        startWorkspace:
            startMutation.mutateAsync,

        stopWorkspace:
            stopMutation.mutateAsync,

        isStarting:
            startMutation.isPending,

        isStopping:
            stopMutation.isPending,
    };
}