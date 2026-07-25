// src/features/dashboard/utils/formatRelativeTime.ts

/**
 * "Updated 2h ago" style relative timestamp. Returns a fallback for
 * missing/invalid input rather than throwing, since this renders
 * directly in project cards.
 */
export function formatRelativeTime(
    input: string | Date | undefined | null,
): string {
    if (!input) return 'Unknown';

    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return 'Unknown';

    const diffMs = Date.now() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 60) return 'Updated just now';

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
        return `Updated ${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return `Updated ${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) {
        return `Updated ${diffDays}d ago`;
    }

    return `Updated ${date.toLocaleDateString()}`;
}