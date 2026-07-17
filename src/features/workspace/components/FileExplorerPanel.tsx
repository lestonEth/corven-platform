// src/features/workspace/components/FileExplorerPanel.tsx
import {
    ChevronDown,
    ChevronRight,
    FileCode,
    Folder,
    FolderPlus,
    Plus,
    RefreshCw,
    Trash2,
} from 'lucide-react';

import {
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from 'react';

import { buildFileTree } from '../utils/file-tree';

import type { FileTreeNode } from '../utils/file-tree';
import type { WorkspaceEntry } from '../types/workspace.types';

type CreateEntryType = 'file' | 'directory';

interface FileExplorerPanelProps {
    entries: WorkspaceEntry[];
    activePath: string;
    isRefreshing: boolean;

    onSelectFile: (path: string) => void;
    onRefresh: () => void;

    onCreateFile: (
        path: string,
    ) => Promise<void>;

    onCreateDirectory: (
        path: string,
    ) => Promise<void>;

    onDelete: (
        path: string,
    ) => Promise<void>;
}

export function FileExplorerPanel({
    entries,
    activePath,
    isRefreshing,
    onSelectFile,
    onRefresh,
    onCreateFile,
    onCreateDirectory,
    onDelete,
}: FileExplorerPanelProps) {
    const [creatingType, setCreatingType] =
        useState<CreateEntryType | null>(null);

    const [error, setError] =
        useState<string | null>(null);

    const tree = useMemo(
        () => buildFileTree(entries),
        [entries],
    );

    const handleCreate = async (
        name: string,
    ): Promise<void> => {
        setError(null);

        try {
            if (creatingType === 'directory') {
                await onCreateDirectory(name);
            } else if (creatingType === 'file') {
                await onCreateFile(name);
                onSelectFile(name);
            }

            setCreatingType(null);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : `Failed to create ${creatingType}`;

            setError(message);

            throw error;
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-11 items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-3">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">
                    Explorer
                </span>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        title="New file"
                        disabled={creatingType !== null}
                        onClick={() => {
                            setError(null);
                            setCreatingType('file');
                        }}
                        className="rounded p-1 text-gray-500 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </button>

                    <button
                        type="button"
                        title="New folder"
                        disabled={creatingType !== null}
                        onClick={() => {
                            setError(null);
                            setCreatingType('directory');
                        }}
                        className="rounded p-1 text-gray-500 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <FolderPlus className="h-3.5 w-3.5" />
                    </button>

                    <button
                        type="button"
                        title="Refresh"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="rounded p-1 text-gray-500 hover:bg-gray-800 hover:text-white disabled:opacity-40"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${isRefreshing
                                    ? 'animate-spin'
                                    : ''
                                }`}
                        />
                    </button>
                </div>
            </div>

            {error && (
                <div className="border-b border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-400">
                    {error}
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-2">
                {creatingType && (
                    <InlineCreateInput
                        depth={0}
                        type={creatingType}
                        onSubmit={handleCreate}
                        onCancel={() => {
                            setCreatingType(null);
                            setError(null);
                        }}
                    />
                )}

                {tree.length === 0 &&
                    !creatingType && (
                        <div className="px-3 py-5 text-center text-xs text-gray-600">
                            No files in this workspace.
                        </div>
                    )}

                {tree.map((node) => (
                    <FileTreeItem
                        key={node.path}
                        node={node}
                        depth={0}
                        activePath={activePath}
                        onSelectFile={onSelectFile}
                        onCreateFile={onCreateFile}
                        onCreateDirectory={
                            onCreateDirectory
                        }
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}

interface FileTreeItemProps {
    node: FileTreeNode;
    depth: number;
    activePath: string;

    onSelectFile: (path: string) => void;

    onCreateFile: (
        path: string,
    ) => Promise<void>;

    onCreateDirectory: (
        path: string,
    ) => Promise<void>;

    onDelete: (
        path: string,
    ) => Promise<void>;
}

function FileTreeItem({
    node,
    depth,
    activePath,
    onSelectFile,
    onCreateFile,
    onCreateDirectory,
    onDelete,
}: FileTreeItemProps) {
    const [expanded, setExpanded] =
        useState(true);

    const [creatingType, setCreatingType] =
        useState<CreateEntryType | null>(null);

    const [isDeleting, setIsDeleting] =
        useState(false);

    const isDirectory =
        node.type === 'directory';

    const createNestedPath = (
        name: string,
    ): string => {
        if (!isDirectory) {
            return name;
        }

        return `${node.path}/${name}`;
    };

    const handleCreate = async (
        name: string,
    ): Promise<void> => {
        const path = createNestedPath(name);

        if (creatingType === 'directory') {
            await onCreateDirectory(path);
        } else if (creatingType === 'file') {
            await onCreateFile(path);
            onSelectFile(path);
        }

        setExpanded(true);
        setCreatingType(null);
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Delete "${node.path}"?`,
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            await onDelete(node.path);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <div
                className={`group flex items-center rounded text-xs ${activePath === node.path
                        ? 'bg-[#1f6feb]/10 text-[#58a6ff]'
                        : 'text-gray-400 hover:bg-gray-800/30 hover:text-gray-200'
                    }`}
                style={{
                    paddingLeft: depth * 12,
                }}
            >
                <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-1.5 py-1"
                    onClick={() => {
                        if (isDirectory) {
                            setExpanded(
                                (current) => !current,
                            );
                        } else {
                            onSelectFile(node.path);
                        }
                    }}
                >
                    {isDirectory ? (
                        <>
                            {expanded ? (
                                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                            ) : (
                                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                            )}

                            <Folder className="h-3.5 w-3.5 shrink-0 text-[#58a6ff]" />
                        </>
                    ) : (
                        <>
                            <span className="w-3.5 shrink-0" />

                            <FileCode className="h-3.5 w-3.5 shrink-0" />
                        </>
                    )}

                    <span className="truncate">
                        {node.name}
                    </span>
                </button>

                {isDirectory && (
                    <>
                        <button
                            type="button"
                            title="New file"
                            onClick={(event) => {
                                event.stopPropagation();
                                setExpanded(true);
                                setCreatingType('file');
                            }}
                            className="hidden rounded p-1 text-gray-600 hover:text-white group-hover:block"
                        >
                            <Plus className="h-3 w-3" />
                        </button>

                        <button
                            type="button"
                            title="New folder"
                            onClick={(event) => {
                                event.stopPropagation();
                                setExpanded(true);
                                setCreatingType(
                                    'directory',
                                );
                            }}
                            className="hidden rounded p-1 text-gray-600 hover:text-white group-hover:block"
                        >
                            <FolderPlus className="h-3 w-3" />
                        </button>
                    </>
                )}

                <button
                    type="button"
                    title="Delete"
                    disabled={isDeleting}
                    onClick={(event) => {
                        event.stopPropagation();
                        void handleDelete();
                    }}
                    className="mr-1 hidden rounded p-1 text-gray-600 hover:text-rose-400 disabled:opacity-40 group-hover:block"
                >
                    <Trash2 className="h-3 w-3" />
                </button>
            </div>

            {isDirectory && expanded && (
                <>
                    {creatingType && (
                        <InlineCreateInput
                            depth={depth + 1}
                            type={creatingType}
                            onSubmit={handleCreate}
                            onCancel={() =>
                                setCreatingType(null)
                            }
                        />
                    )}

                    {node.children.map((child) => (
                        <FileTreeItem
                            key={child.path}
                            node={child}
                            depth={depth + 1}
                            activePath={activePath}
                            onSelectFile={onSelectFile}
                            onCreateFile={onCreateFile}
                            onCreateDirectory={
                                onCreateDirectory
                            }
                            onDelete={onDelete}
                        />
                    ))}
                </>
            )}
        </div>
    );
}

interface InlineCreateInputProps {
    depth: number;
    type: CreateEntryType;

    onSubmit: (
        name: string,
    ) => Promise<void>;

    onCancel: () => void;
}

function InlineCreateInput({
    depth,
    type,
    onSubmit,
    onCancel,
}: InlineCreateInputProps) {
    const [value, setValue] =
        useState('');

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const hasCommittedRef =
        useRef(false);

    const commit = async () => {
        if (
            hasCommittedRef.current ||
            isSubmitting
        ) {
            return;
        }

        const trimmed = value.trim();

        if (!trimmed) {
            onCancel();
            return;
        }

        if (
            trimmed.includes('/') ||
            trimmed.includes('\\')
        ) {
            setError(
                'Enter only a file or folder name.',
            );

            return;
        }

        if (
            trimmed === '.' ||
            trimmed === '..'
        ) {
            setError('Invalid name.');
            return;
        }

        hasCommittedRef.current = true;
        setIsSubmitting(true);
        setError(null);

        try {
            await onSubmit(trimmed);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : `Unable to create ${type}`;

            setError(message);
            hasCommittedRef.current = false;
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (
        event: KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();

            void commit();
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();

            onCancel();
        }
    };

    return (
        <div>
            <div
                className="flex items-center gap-1.5 py-1"
                style={{
                    paddingLeft:
                        depth * 12 + 22,
                }}
            >
                {type === 'directory' ? (
                    <Folder className="h-3.5 w-3.5 shrink-0 text-[#58a6ff]" />
                ) : (
                    <FileCode className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                )}

                <input
                    autoFocus
                    value={value}
                    disabled={isSubmitting}
                    onChange={(event) => {
                        setValue(event.target.value);
                        setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                        if (
                            !hasCommittedRef.current &&
                            value.trim()
                        ) {
                            void commit();
                        } else if (!value.trim()) {
                            onCancel();
                        }
                    }}
                    placeholder={
                        type === 'directory'
                            ? 'Folder name'
                            : 'File name'
                    }
                    className="w-full min-w-0 rounded border border-[#1f6feb] bg-[#0d1117] px-1 py-0.5 text-xs text-gray-200 outline-none disabled:opacity-50"
                />
            </div>

            {error && (
                <div
                    className="pb-1 text-[10px] text-rose-400"
                    style={{
                        paddingLeft:
                            depth * 12 + 42,
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    );
}