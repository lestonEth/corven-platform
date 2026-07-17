// src/features/workspace/utils/file-tree.ts
import type {
    WorkspaceEntry,
} from '../types/workspace.types';

export interface FileTreeNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children: FileTreeNode[];
}

export function buildFileTree(
    entries: WorkspaceEntry[],
): FileTreeNode[] {
    const root: FileTreeNode[] = [];

    const sorted = [...entries].sort(
        (a, b) => {
            if (a.type !== b.type) {
                return a.type === 'directory'
                    ? -1
                    : 1;
            }

            return a.path.localeCompare(b.path);
        },
    );

    for (const entry of sorted) {
        const parts = entry.path.split('/');
        let currentLevel = root;
        let currentPath = '';

        parts.forEach((part, index) => {
            currentPath = currentPath
                ? `${currentPath}/${part}`
                : part;

            const isLast =
                index === parts.length - 1;

            let node = currentLevel.find(
                (item) => item.name === part,
            );

            if (!node) {
                node = {
                    name: part,
                    path: currentPath,
                    type: isLast
                        ? entry.type
                        : 'directory',
                    children: [],
                };

                currentLevel.push(node);
            }

            currentLevel = node.children;
        });
    }

    return root;
}