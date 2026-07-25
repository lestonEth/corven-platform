// src/features/workspace/components/CreateWorkspaceModal.tsx
import React, { useState } from 'react';
import {
    Box,
    FileCode2,
    Terminal,
    Sparkles,
} from 'lucide-react';

import { Modal } from '../../../components/ui/Modal';
import { useWorkspaces } from '../hooks/useWorkspaces';
import type { Workspace } from '../../workspace/types/workspace.types';

interface WorkspaceTemplate {
    id: string;
    name: string;
    description: string;
    icon: typeof Box;
}

// Hardcoded for now — swap for a real templates endpoint
// (e.g. workspaceApi.listTemplates()) when one exists.
const WORKSPACE_TEMPLATES: WorkspaceTemplate[] = [
    {
        id: 'rust-empty',
        name: 'Rust',
        description: 'Empty Cargo project',
        icon: Terminal,
    },
    {
        id: 'node-typescript',
        name: 'Node.js + TypeScript',
        description: 'Bare Node/TS setup',
        icon: FileCode2,
    },
    {
        id: 'python-empty',
        name: 'Python',
        description: 'Empty Python project',
        icon: Sparkles,
    },
    {
        id: 'blank',
        name: 'Blank Workspace',
        description: 'No starter files',
        icon: Box,
    },
];

interface CreateWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Fired after the workspace is successfully created. */
    onCreated: (workspace: Workspace) => void;
    /** Pre-selects a template, e.g. when opened from "Use Template". */
    initialTemplateId?: string;
}

export function CreateWorkspaceModal({
    isOpen,
    onClose,
    onCreated,
    initialTemplateId,
}: CreateWorkspaceModalProps) {
    const {
        createWorkspace,
        isCreating,
        createError,
        resetCreateError,
    } = useWorkspaces();

    const [name, setName] = useState('');
    const [templateId, setTemplateId] = useState(
        initialTemplateId ?? WORKSPACE_TEMPLATES[0].id,
    );

    const handleClose = () => {
        if (isCreating) return;
        setName('');
        setTemplateId(initialTemplateId ?? WORKSPACE_TEMPLATES[0].id);
        resetCreateError();
        onClose();
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        if (!name.trim() || isCreating) return;

        const workspace = await createWorkspace({
            name: name.trim(),
            templateId,
        });

        onCreated(workspace);
        handleClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create Workspace"
            footer={
                <>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isCreating}
                        className="rounded-lg border border-[#30363d] px-4 py-2 text-xs font-semibold text-gray-300 transition-colors hover:bg-[#21262d] disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        form="create-workspace-form"
                        disabled={!name.trim() || isCreating}
                        className="rounded-lg bg-[#1f6feb] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#388bfd] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isCreating
                            ? 'Creating...'
                            : 'Create Workspace'}
                    </button>
                </>
            }
        >
            <form
                id="create-workspace-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
            >
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="workspace-name"
                        className="text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                    >
                        Workspace name
                    </label>
                    <input
                        id="workspace-name"
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="my-fiber-service"
                        autoFocus
                        className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 font-mono text-sm text-gray-200 outline-none placeholder:text-gray-600 focus:border-[#1f6feb]"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        Template
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                        {WORKSPACE_TEMPLATES.map(
                            (template) => {
                                const Icon = template.icon;
                                const isSelected =
                                    template.id ===
                                    templateId;

                                return (
                                    <button
                                        key={template.id}
                                        type="button"
                                        onClick={() =>
                                            setTemplateId(
                                                template.id,
                                            )
                                        }
                                        className={
                                            'flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-colors ' +
                                            (isSelected
                                                ? 'border-[#1f6feb] bg-[#1f6feb]/10'
                                                : 'border-[#30363d] hover:border-gray-500')
                                        }
                                    >
                                        <Icon
                                            className={
                                                'h-4 w-4 ' +
                                                (isSelected
                                                    ? 'text-[#58a6ff]'
                                                    : 'text-gray-400')
                                            }
                                        />
                                        <span className="text-xs font-semibold text-gray-200">
                                            {template.name}
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                            {
                                                template.description
                                            }
                                        </span>
                                    </button>
                                );
                            },
                        )}
                    </div>
                </div>

                {createError && (
                    <p className="text-xs text-rose-400">
                        {createError instanceof Error
                            ? createError.message
                            : 'Failed to create workspace. Try again.'}
                    </p>
                )}
            </form>
        </Modal>
    );
}