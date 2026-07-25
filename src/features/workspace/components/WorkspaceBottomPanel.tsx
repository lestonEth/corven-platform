// src/features/workspace/components/WorkspaceBottomPanel.tsx
'use client';

import {
    FlaskConical,
    TerminalSquare,
    X,
    Hammer,
} from 'lucide-react';

import React, { useState } from 'react';

import { TerminalPanel } from './TerminalPanel';
import { TestsPanel } from './TestsPanel';
import { BuildPanel } from './BuildPanel';

type BottomPanelTab =
    | 'terminal'
    | 'tests'
    | 'build'
    | 'output'
    | 'problems';

interface WorkspaceBottomPanelProps {
    workspaceId: string;
    onClose: () => void;
}

export function WorkspaceBottomPanel({
    workspaceId,
    onClose,
}: WorkspaceBottomPanelProps) {
    const [activeTab, setActiveTab] =
        useState<BottomPanelTab>(
            'terminal',
        );

    return (
        <section className="flex h-full min-h-0 flex-col bg-[#0d1117]">
            <header className="flex h-9 shrink-0 items-center justify-between border-b border-[#30363d] px-3">
                <div className="flex h-full items-center gap-4">
                    <PanelTab
                        label="Terminal"
                        active={
                            activeTab ===
                            'terminal'
                        }
                        icon={
                            <TerminalSquare className="h-3.5 w-3.5" />
                        }
                        onClick={() =>
                            setActiveTab(
                                'terminal',
                            )
                        }
                    />

                    <PanelTab
                        label="Tests"
                        active={
                            activeTab ===
                            'tests'
                        }
                        icon={
                            <FlaskConical className="h-3.5 w-3.5" />
                        }
                        onClick={() =>
                            setActiveTab(
                                'tests',
                            )
                        }
                    />

                    <PanelTab
                        label="Build"
                        active={activeTab === 'build'}
                        icon={<Hammer className="h-3.5 w-3.5" />}
                        onClick={() => setActiveTab('build')}
                    />

                    <PanelTab
                        label="Output"
                        active={
                            activeTab ===
                            'output'
                        }
                        onClick={() =>
                            setActiveTab(
                                'output',
                            )
                        }
                    />

                    <PanelTab
                        label="Problems"
                        active={
                            activeTab ===
                            'problems'
                        }
                        onClick={() =>
                            setActiveTab(
                                'problems',
                            )
                        }
                    />
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    title="Close panel"
                    className="rounded p-1 text-gray-500 transition hover:bg-[#21262d] hover:text-gray-200"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            </header>

            <div className="min-h-0 flex-1 overflow-hidden">
                <div className={activeTab === 'terminal' ? 'h-full' : 'hidden'}>
                    <TerminalPanel
                        workspaceId={workspaceId}
                        embedded
                    />
                </div>

                <div className={activeTab === 'tests' ? 'h-full' : 'hidden'}>
                    <TestsPanel
                        workspaceId={workspaceId}
                    />
                </div>

                <div className={activeTab === 'build' ? 'h-full' : 'hidden'}>
                    <BuildPanel workspaceId={workspaceId} />
                </div>

                {activeTab === 'output' && (
                    <PlaceholderPanel
                        title="Output"
                        description="Build and runtime output will appear here."
                    />
                )}

                {activeTab === 'problems' && (
                    <PlaceholderPanel
                        title="Problems"
                        description="Compiler errors, warnings, and diagnostics will appear here."
                    />
                )}
            </div>
        </section>
    );
}

interface PanelTabProps {
    label: string;
    active: boolean;
    icon?: React.ReactNode;
    onClick: () => void;
}

function PanelTab({
    label,
    active,
    icon,
    onClick,
}: PanelTabProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'flex h-full items-center gap-1.5 border-b px-1 text-[11px] font-medium uppercase tracking-wide transition',
                active
                    ? 'border-[#58a6ff] text-gray-200'
                    : 'border-transparent text-gray-500 hover:text-gray-300',
            ].join(' ')}
        >
            {icon}
            {label}
        </button>
    );
}

function PlaceholderPanel({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex h-full items-center justify-center p-6 text-center">
            <div>
                <p className="text-sm font-medium text-gray-300">
                    {title}
                </p>

                <p className="mt-1 text-xs text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    );
}