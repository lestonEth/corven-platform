// src/features/workspace/components/ComingSoonModal.tsx
import { Modal } from '../../../components/ui/Modal';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

/**
 * Placeholder for actions that don't have a backend endpoint yet
 * (e.g. "Import Repository" — there's no repo-import API on
 * workspaceApi today). Swap this out once the real flow exists.
 */
export function ComingSoonModal({
    isOpen,
    onClose,
    title,
    description,
}: ComingSoonModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg bg-[#1f6feb] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#388bfd]"
                >
                    Got it
                </button>
            }
        >
            <p className="text-sm text-gray-400">
                {description}
            </p>
        </Modal>
    );
}