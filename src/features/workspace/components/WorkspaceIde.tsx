'use client';

import { useState } from 'react';

import type { IdePanel } from '../types/workspace.types';

import { FileExplorerPanel } from './FileExplorerPanel';
import { EditorPanel } from './EditorPanel';
import { AIPanel } from './AIPanel';
import { WorkspaceBottomPanel } from './WorkspaceBottomPanel';

import { useWorkspaceFiles } from '../hooks/useWorkspaceFiles';
import { useActiveFile } from '../hooks/useActiveFile';
import { useResizablePanel } from '../hooks/useResizablePanel';
import { ResizeHandle } from './ResizeHandle';

interface WorkspaceIdeProps {
    workspaceId: string;
    activePanel: IdePanel;
}

export function WorkspaceIde({
    workspaceId,
    activePanel,
}: WorkspaceIdeProps) {
    const [terminalVisible, setTerminalVisible] =
        useState(true);

    const files = useWorkspaceFiles(workspaceId);

    const editor = useActiveFile({
        entries: files.entries,
        readFile: files.readFile,
        updateFile: files.updateFile,
    });

    // Left file-tree sidebar: drag its right edge.
    const sidebar = useResizablePanel({
        axis: 'horizontal',
        initialSize: 256, // matches old w-64
        minSize: 180,
        maxSize: 480,
        storageKey: 'fiberdev.ide.sidebarWidth',
    });

    // Terminal panel: drag its top edge. Growing downward shrinks it,
    // so this one is "reverse".
    const terminal = useResizablePanel({
        axis: 'vertical',
        initialSize: 260,
        minSize: 120,
        maxSize: 640,
        reverse: true,
        storageKey: 'fiberdev.ide.terminalHeight',
    });

    // AI assistant panel: drag its left edge. Growing rightward shrinks
    // it (it's pinned to the right edge), so "reverse" here too.
    const aiPanel = useResizablePanel({
        axis: 'horizontal',
        initialSize: 320, // matches old w-80
        minSize: 240,
        maxSize: 560,
        reverse: true,
        storageKey: 'fiberdev.ide.aiPanelWidth',
    });

    const isResizing =
        sidebar.isDragging ||
        terminal.isDragging ||
        aiPanel.isDragging;

    return (
        <div
            className="flex h-full w-full min-w-0 overflow-hidden bg-[#0d1117] text-gray-200"
            style={
                isResizing
                    ? { userSelect: 'none', cursor: 'inherit' }
                    : undefined
            }
        >
            {/* Left Sidebar (file tree / search / git / debug) */}
            <aside
                className="flex h-full shrink-0 flex-col overflow-hidden bg-[#161b22]"
                style={{ width: sidebar.size }}
            >
                {activePanel === 'files' && (
                    <FileExplorerPanel
                        entries={files.entries}
                        activePath={editor.activePath}
                        isRefreshing={files.isRefreshing}
                        onSelectFile={editor.selectFile}
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

            <ResizeHandle
                axis="horizontal"
                isDragging={sidebar.isDragging}
                onPointerDown={sidebar.onPointerDown}
            />

            {/* Main IDE (editor + terminal) */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-hidden">
                    <EditorPanel
                        file={editor.activeFile}
                        content={editor.content}
                        isDirty={editor.isDirty}
                        isSaving={files.isSaving}
                        isLoading={editor.isLoadingFile}
                        onChange={editor.setContent}
                        onSave={editor.save}
                    />
                </div>

                {terminalVisible ? (
                    <>
                        <ResizeHandle
                            axis="vertical"
                            isDragging={terminal.isDragging}
                            onPointerDown={
                                terminal.onPointerDown
                            }
                        />
                        <div
                            className="shrink-0 overflow-hidden border-t border-[#30363d]"
                            style={{ height: terminal.size }}
                        >
                            <WorkspaceBottomPanel
                                workspaceId={
                                    workspaceId
                                }
                                onClose={() =>
                                    setTerminalVisible(
                                        false,
                                    )
                                }
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex h-8 shrink-0 items-center border-t border-[#30363d] bg-[#0d1117] px-3">
                        <button
                            type="button"
                            onClick={() =>
                                setTerminalVisible(true)
                            }
                            className="text-[11px] font-medium uppercase tracking-wide text-gray-500 transition hover:text-gray-200"
                        >
                            Open Terminal
                        </button>
                    </div>
                )}
            </div>

            <ResizeHandle
                axis="horizontal"
                isDragging={aiPanel.isDragging}
                onPointerDown={aiPanel.onPointerDown}
            />

            {/* AI Assistant */}
            <aside
                className="flex h-full shrink-0 flex-col overflow-hidden border-l border-[#30363d] bg-[#161b22]"
                style={{ width: aiPanel.size }}
            >
                <AIPanel />
            </aside>
        </div>
    );
}