// src/features/dashboard/components/ConfirmDialog.tsx
import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
}: ConfirmDialogProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Focus the confirm button when dialog opens
            setTimeout(() => {
                confirmButtonRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: 'text-rose-500',
            button: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
            border: 'border-rose-500/20',
        },
        warning: {
            icon: 'text-amber-500',
            button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
            border: 'border-amber-500/20',
        },
        info: {
            icon: 'text-[#58a6ff]',
            button: 'bg-[#1f6feb] hover:bg-[#388bfd] focus:ring-[#1f6feb]',
            border: 'border-[#1f6feb]/20',
        },
    };

    const styles = variantStyles[variant];

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === overlayRef.current) {
                    onClose();
                }
            }}
        >
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full bg-[#0d1117] border ${styles.border}`}>
                            <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-white">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-400">
                                {description}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#0d1117] transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 bg-[#0d1117] rounded-b-2xl border-t border-[#30363d]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1117] ${styles.button}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}