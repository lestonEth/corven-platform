import type {
    WorkspaceTestCase,
    WorkspaceTestSummary,
} from '../types/test.types';

interface ParsedTestOutput {
    tests: WorkspaceTestCase[];
    summary: WorkspaceTestSummary;
}

const TEST_CASE_PATTERN =
    /^test\s+(.+?)\s+\.\.\.\s+(ok|FAILED|ignored)$/gm;

const SUMMARY_PATTERN =
    /test result:\s+(?:ok|FAILED)\.\s+(\d+)\s+passed;\s+(\d+)\s+failed;\s+(\d+)\s+ignored;\s+(\d+)\s+measured;\s+(\d+)\s+filtered out;(?:\s+finished in\s+([\d.]+)s)?/g;

function createTestId(
    name: string,
    index: number,
): string {
    return `${name}-${index}`;
}

export function parseTestOutput(
    output: string,
): ParsedTestOutput {
    const tests: WorkspaceTestCase[] = [];

    let testMatch: RegExpExecArray | null;

    while (
        (testMatch =
            TEST_CASE_PATTERN.exec(output)) !== null
    ) {
        const [, name, result] = testMatch;

        tests.push({
            id: createTestId(
                name,
                tests.length,
            ),
            name,
            status:
                result === 'ok'
                    ? 'passed'
                    : result === 'ignored'
                        ? 'ignored'
                        : 'failed',
        });
    }

    let passed = 0;
    let failed = 0;
    let ignored = 0;
    let filteredOut = 0;
    let durationMs: number | undefined;

    let summaryMatch: RegExpExecArray | null;

    while (
        (summaryMatch =
            SUMMARY_PATTERN.exec(output)) !==
        null
    ) {
        passed += Number(summaryMatch[1]);
        failed += Number(summaryMatch[2]);
        ignored += Number(summaryMatch[3]);
        filteredOut += Number(
            summaryMatch[5],
        );

        if (summaryMatch[6]) {
            durationMs =
                (durationMs ?? 0) +
                Number(summaryMatch[6]) *
                1000;
        }
    }

    return {
        tests,
        summary: {
            passed,
            failed,
            ignored,
            filteredOut,
            total:
                passed +
                failed +
                ignored,
            durationMs,
        },
    };
}