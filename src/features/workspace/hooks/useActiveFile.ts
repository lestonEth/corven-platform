// src/features/workspace/hooks/useActiveFile.ts
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import type {
    WorkspaceEntry,
    WorkspaceFile,
} from '../types/workspace.types';

interface UseActiveFileOptions {
    entries: WorkspaceEntry[];

    readFile: (
        path: string,
    ) => Promise<WorkspaceFile>;

    updateFile: (input: {
        path: string;
        content: string;
    }) => Promise<WorkspaceFile>;
}

export function useActiveFile({
    entries,
    readFile,
    updateFile,
}: UseActiveFileOptions) {
    const fileEntries = useMemo(
        () =>
            entries.filter(
                (entry) =>
                    entry.type === 'file',
            ),
        [entries],
    );

    const [activePath, setActivePath] =
        useState('');

    const [activeFile, setActiveFile] =
        useState<WorkspaceFile | null>(null);

    const [content, setContent] =
        useState('');

    const [savedContent, setSavedContent] =
        useState('');

    const [isLoadingFile, setIsLoadingFile] =
        useState(false);

    useEffect(() => {
        if (
            !activePath &&
            fileEntries.length > 0
        ) {
            setActivePath(fileEntries[0].path);
        }
    }, [activePath, fileEntries]);

    useEffect(() => {
        if (!activePath) {
            setActiveFile(null);
            setContent('');
            setSavedContent('');
            return;
        }

        let cancelled = false;

        const loadFile = async () => {
            setIsLoadingFile(true);

            try {
                const file =
                    await readFile(activePath);

                if (cancelled) {
                    return;
                }

                setActiveFile(file);
                setContent(file.content ?? '');
                setSavedContent(file.content ?? '');
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        'Failed to load file:',
                        error,
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingFile(false);
                }
            }
        };

        void loadFile();

        return () => {
            cancelled = true;
        };
    }, [activePath, readFile]);

    const isDirty =
        content !== savedContent;

    const selectFile = useCallback(
        (path: string) => {
            if (path === activePath) {
                return;
            }

            if (
                isDirty &&
                !window.confirm(
                    'Discard unsaved changes?',
                )
            ) {
                return;
            }

            setActivePath(path);
        },
        [activePath, isDirty],
    );

    const save = useCallback(async () => {
        if (!activeFile) {
            return;
        }

        const updatedFile =
            await updateFile({
                path: activeFile.path,
                content,
            });

        setActiveFile(updatedFile);
        setContent(updatedFile.content ?? content);
        setSavedContent(
            updatedFile.content ?? content,
        );
    }, [
        activeFile,
        content,
        updateFile,
    ]);

    return {
        activePath,
        activeFile,
        content,
        setContent,
        selectFile,
        save,
        isDirty,
        isLoadingFile,
    };
}