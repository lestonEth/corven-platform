// src/components/ui/Modal.tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    /** Optional footer, typically action buttons. */
    footer?: React.ReactNode;
}

/**
 * Minimal, dependency-free modal shell matching the app's dark theme.
 * If you already have a UI primitive for this (e.g. via shadcn/radix
 * dialog), prefer that instead — this exists so CreateWorkspaceModal
 * and friends have somewhere to live without pulling in a new library.
 */
export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
}: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        return () =>
            document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#30363d] px-5 py-4">
                    <h2 className="text-sm font-bold text-white">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 text-gray-500 transition-colors hover:bg-[#21262d] hover:text-gray-200"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="px-5 py-5">{children}</div>

                {footer && (
                    <div className="flex items-center justify-end gap-3 border-t border-[#30363d] px-5 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}