// src/features/workspace/components/WorkspaceIde.tsx
import type {
    IdePanel,
} from '../types/workspace.types';

import { FileExplorerPanel } from './FileExplorerPanel';
import { EditorPanel } from './EditorPanel';

import { useWorkspaceFiles } from '../hooks/useWorkspaceFiles';
import { useActiveFile } from '../hooks/useActiveFile';

interface WorkspaceIdeProps {
    workspaceId: string;
    activePanel: IdePanel;
}

export function WorkspaceIde({
    workspaceId,
    activePanel,
}: WorkspaceIdeProps) {
    const files = useWorkspaceFiles(
        workspaceId,
    );

    const editor = useActiveFile({
        entries: files.entries,
        readFile: files.readFile,
        updateFile: files.updateFile,
    });

    return (
        <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0d1117] text-gray-200">
            <aside className="flex w-64 shrink-0 flex-col border-r border-[#30363d] bg-[#161b22]">
                {activePanel === 'files' && (
                    <FileExplorerPanel
                        entries={files.entries}
                        activePath={
                            editor.activePath
                        }
                        isRefreshing={
                            files.isRefreshing
                        }
                        onSelectFile={
                            editor.selectFile
                        }
                        onRefresh={() => {
                            void files.refreshFiles();
                        }}
                        onCreateFile={async (path) => {
                            const created =
                                await files.createFile({
                                    path,
                                    content: '',
                                });

                            editor.selectFile(
                                created.path,
                            );
                        }}
                        onCreateDirectory={async (
                            path,
                        ) => {
                            await files.createDirectory({
                                path,
                            });
                        }}
                        onDelete={async (path) => {
                            await files.deleteFile(path);
                        }}
                    />
                )}

                {activePanel === 'search' && (
                    <div className="p-4 text-xs text-gray-500">
                        Search panel comes here.
                    </div>
                )}

                {activePanel === 'git' && (
                    <div className="p-4 text-xs text-gray-500">
                        Source control panel comes here.
                    </div>
                )}

                {activePanel === 'debug' && (
                    <div className="p-4 text-xs text-gray-500">
                        Run and debug panel comes here.
                    </div>
                )}
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <EditorPanel
                    file={editor.activeFile}
                    content={editor.content}
                    isDirty={editor.isDirty}
                    isSaving={files.isSaving}
                    isLoading={
                        editor.isLoadingFile
                    }
                    onChange={editor.setContent}
                    onSave={editor.save}
                />

                <div className="h-52 shrink-0 border-t border-[#30363d] bg-[#0d1117] p-4 font-mono text-xs text-gray-500">
                    Runtime terminal will be mounted here.
                </div>
            </div>

            <aside className="w-80 shrink-0 border-l border-[#30363d] bg-[#161b22] p-4 text-xs text-gray-500">
                AI Assistant
            </aside>
        </div>
    );
}