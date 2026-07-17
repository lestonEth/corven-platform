// src/features/workspace/components/EditorPanel.tsx
import {
    Check,
    FileCode,
    Save,
} from 'lucide-react';

import type {
    WorkspaceFile,
} from '../types/workspace.types';

interface EditorPanelProps {
    file: WorkspaceFile | null;
    content: string;
    isDirty: boolean;
    isSaving: boolean;
    isLoading: boolean;

    onChange: (content: string) => void;
    onSave: () => Promise<void>;
}

export function EditorPanel({
    file,
    content,
    isDirty,
    isSaving,
    isLoading,
    onChange,
    onSave,
}: EditorPanelProps) {
    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
                Loading file...
            </div>
        );
    }

    if (!file) {
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
                Select a file to start editing.
            </div>
        );
    }

    return (
        <section className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-11 items-center border-b border-[#30363d] bg-[#161b22]">
                <div className="flex h-full items-center gap-2 border-r border-t-2 border-r-[#30363d] border-t-[#1f6feb] bg-[#0d1117] px-4 text-[#58a6ff]">
                    <FileCode className="h-3.5 w-3.5" />

                    <span className="font-mono text-xs">
                        {file.name}
                        {isDirty && ' •'}
                    </span>
                </div>
            </div>

            <div className="flex h-9 items-center justify-between border-b border-[#30363d]/60 px-4">
                <span className="truncate font-mono text-[11px] text-gray-500">
                    WORKSPACE &gt; {file.path}
                </span>

                <button
                    type="button"
                    disabled={
                        !isDirty || isSaving
                    }
                    onClick={() =>
                        void onSave()
                    }
                    className="flex items-center gap-1 rounded border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-[11px] text-gray-300 disabled:opacity-50"
                >
                    {isDirty ? (
                        <Save className="h-3.5 w-3.5" />
                    ) : (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                    )}

                    {isSaving
                        ? 'Saving...'
                        : isDirty
                            ? 'Save'
                            : 'Saved'}
                </button>
            </div>

            <div className="flex min-h-0 flex-1">
                <div className="w-12 border-r border-gray-800/50 pt-4 pr-3 text-right font-mono text-[11px] leading-[1.6] text-gray-600">
                    {content
                        .split('\n')
                        .map((_, index) => (
                            <div key={index}>
                                {index + 1}
                            </div>
                        ))}
                </div>

                <textarea
                    value={content}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    spellCheck={false}
                    className="h-full flex-1 resize-none bg-transparent p-4 font-mono text-xs leading-[1.6] text-gray-300 outline-none"
                />
            </div>
        </section>
    );
}