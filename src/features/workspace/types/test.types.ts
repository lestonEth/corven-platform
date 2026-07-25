export type TestRunStatus =
    | 'idle'
    | 'queued'
    | 'running'
    | 'passed'
    | 'failed'
    | 'cancelled'
    | 'error';

export type TestCaseStatus =
    | 'running'
    | 'passed'
    | 'failed'
    | 'ignored';

export interface WorkspaceTestCase {
    id: string;
    name: string;
    status: TestCaseStatus;
    durationMs?: number;
    error?: string;
}

export interface WorkspaceTestSummary {
    passed: number;
    failed: number;
    ignored: number;
    filteredOut: number;
    total: number;
    durationMs?: number;
}

export interface WorkspaceTestRun {
    runId: string | null;
    status: TestRunStatus;
    startedAt: string | null;
    finishedAt: string | null;
    output: string;
    tests: WorkspaceTestCase[];
    summary: WorkspaceTestSummary;
}

export interface TestOutputEvent {
    workspaceId: string;
    runId: string;
    stream: 'stdout' | 'stderr';
    data: string;
}

export interface TestStartedEvent {
    workspaceId: string;
    runId: string;
    startedAt: string;
}

export interface TestFinishedEvent {
    workspaceId: string;
    runId: string;
    exitCode: number;
    finishedAt: string;
}

export interface TestErrorEvent {
    workspaceId: string;
    runId?: string;
    message: string;
}

export interface TestRunOptions {
    workspaceId: string;
    projectPath?: string;
    command?: string;
}
