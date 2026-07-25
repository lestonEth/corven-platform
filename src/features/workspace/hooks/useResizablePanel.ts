'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Axis = 'horizontal' | 'vertical';

interface UseResizablePanelOptions {
    axis: Axis;
    initialSize: number;
    minSize: number;
    maxSize: number;
    /**
     * If true, dragging in the positive direction (right/down) SHRINKS the
     * panel instead of growing it. Useful for panels anchored to the right
     * edge (e.g. the AI sidebar) or bottom edge.
     */
    reverse?: boolean;
    storageKey?: string;
}

/**
 * Drag-to-resize primitive. Returns the current size, a ref to attach to
 * the drag handle, and whether a resize is currently in progress (so you
 * can disable pointer-events / show a resize cursor on the whole page).
 */
export function useResizablePanel({
    axis,
    initialSize,
    minSize,
    maxSize,
    reverse = false,
    storageKey,
}: UseResizablePanelOptions) {
    const [size, setSize] = useState(() => {
        if (typeof window !== 'undefined' && storageKey) {
            const stored = window.localStorage.getItem(storageKey);
            if (stored) {
                const parsed = Number(stored);
                if (!Number.isNaN(parsed)) return parsed;
            }
        }
        return initialSize;
    });

    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef(0);
    const startSize = useRef(0);

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            e.preventDefault();
            startPos.current = axis === 'horizontal' ? e.clientX : e.clientY;
            startSize.current = size;
            setIsDragging(true);
        },
        [axis, size],
    );

    useEffect(() => {
        if (!isDragging) return;

        const onPointerMove = (e: PointerEvent) => {
            const pos = axis === 'horizontal' ? e.clientX : e.clientY;
            const delta = pos - startPos.current;
            const signedDelta = reverse ? -delta : delta;
            const next = Math.min(
                maxSize,
                Math.max(minSize, startSize.current + signedDelta),
            );
            setSize(next);
        };

        const onPointerUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [isDragging, axis, reverse, minSize, maxSize]);

    useEffect(() => {
        if (!isDragging && storageKey && typeof window !== 'undefined') {
            window.localStorage.setItem(storageKey, String(size));
        }
    }, [isDragging, size, storageKey]);

    return { size, isDragging, onPointerDown };
}