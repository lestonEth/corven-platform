import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { useSearchParams } from 'react-router-dom';

import IdeView from '../components/IdeView';
import { defaultFiles } from '../data/defaultFiles';
import { useNodeState } from '../features/node/hooks/useNodeState';
import type { VirtualFile } from '../types';

type IdePanel =
    | 'files'
    | 'search'
    | 'git'
    | 'debug';

export default function IdePage() {
    const [searchParams] = useSearchParams();

    const activePanel = useMemo<IdePanel>(() => {
        const panel = searchParams.get('panel');

        if (
            panel === 'search' ||
            panel === 'git' ||
            panel === 'debug'
        ) {
            return panel;
        }

        return 'files';
    }, [searchParams]);

    const {
        nodeState,
        refreshNodeState,
    } = useNodeState();

    const [files, setFiles] =
        useState<VirtualFile[]>(defaultFiles);

    const [isLoadingFiles, setIsLoadingFiles] =
        useState(false);

    const [isDeploying, setIsDeploying] =
        useState(false);

    const fetchFiles = useCallback(async () => {
        setIsLoadingFiles(true);

        try {
            const response = await fetch('/api/files');

            if (!response.ok) {
                return;
            }

            const data: unknown = await response.json();

            if (Array.isArray(data)) {
                setFiles(data as VirtualFile[]);
            }
        } catch (error) {
            console.error(
                'Unable to fetch workspace files:',
                error,
            );
        } finally {
            setIsLoadingFiles(false);
        }
    }, []);

    useEffect(() => {
        void fetchFiles();
    }, [fetchFiles]);

    const handleSaveFile = useCallback(
        async (
            path: string,
            content: string,
        ): Promise<void> => {
            const response = await fetch('/api/files', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    path,
                    content,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save file');
            }

            setFiles((currentFiles) =>
                currentFiles.map((file) =>
                    file.path === path
                        ? {
                            ...file,
                            content,
                        }
                        : file,
                ),
            );
        },
        [],
    );

    const handleDeploy = useCallback(async () => {
        if (isDeploying) {
            return;
        }

        setIsDeploying(true);

        try {
            const response = await fetch(
                '/api/node/deploy',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error(
                    'Failed to deploy workspace',
                );
            }

            await refreshNodeState();
        } catch (error) {
            console.error(
                'Workspace deployment failed:',
                error,
            );
        } finally {
            setIsDeploying(false);
        }
    }, [
        isDeploying,
        refreshNodeState,
    ]);

    return (
        <IdeView
            files={files}
            activePanel={activePanel}
            isLoadingFiles={isLoadingFiles}
            onRefreshFiles={fetchFiles}
            onSaveFile={handleSaveFile}
            onDeploy={handleDeploy}
            isDeploying={isDeploying}
            activeBlock={nodeState.blockHeight}
            nodeStatus={nodeState.status}
            terminalLogs={nodeState.logs}
        />
    );
}