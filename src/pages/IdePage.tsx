// src/pages/IdePage.tsx
import {
    Navigate,
    useParams,
    useSearchParams,
} from 'react-router-dom';

import { WorkspaceIde } from '../features/workspace/components/WorkspaceIde';

import type {
    IdePanel,
} from '../features/workspace/types/workspace.types';

function isIdePanel(
    value: string | null,
): value is IdePanel {
    return (
        value === 'files' ||
        value === 'search' ||
        value === 'git' ||
        value === 'debug'
    );
}

export default function IdePage() {
    const { workspaceId } =
        useParams<{
            workspaceId: string;
        }>();

    const [searchParams] =
        useSearchParams();

    if (!workspaceId) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    const panelParam =
        searchParams.get('panel');

    const activePanel: IdePanel =
        isIdePanel(panelParam)
            ? panelParam
            : 'files';

    return (
        <WorkspaceIde
            workspaceId={workspaceId}
            activePanel={activePanel}
        />
    );
}