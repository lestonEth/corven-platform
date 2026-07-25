import { syntaxTree } from '@codemirror/language';
import { linter, type Diagnostic } from '@codemirror/lint';
import type { EditorView } from '@codemirror/view';

/**
 * A generic "does this parse at all" linter, driven off the Lezer syntax
 * tree that every @codemirror/lang-* package already builds for
 * highlighting. Any node the parser couldn't make sense of comes back
 * tagged as an error node — this walks the tree and turns those into
 * diagnostics.
 *
 * This catches structural problems: unclosed braces/parens/brackets,
 * malformed tokens, invalid syntax shapes. It does NOT catch semantic
 * errors (type mismatches, borrow-checker violations, unresolved
 * names) — that requires a real compiler/language server (e.g.
 * rust-analyzer over LSP), which is a separate integration.
 */
export const syntaxErrorLinter = linter(
    (view: EditorView): Diagnostic[] => {
        const diagnostics: Diagnostic[] = [];
        const tree = syntaxTree(view.state);

        tree.iterate({
            enter: (node) => {
                if (!node.type.isError) return;

                const from = node.from;
                const to = Math.max(node.to, node.from + 1);

                diagnostics.push({
                    from,
                    to: Math.min(
                        to,
                        view.state.doc.length,
                    ),
                    severity: 'error',
                    message:
                        'Syntax error: unexpected or incomplete token',
                });
            },
        });

        return diagnostics;
    },
    // Re-lint on every doc change, not just on a delay — the tree is
    // already being reparsed incrementally for highlighting, so this
    // is cheap.
    { delay: 300 },
);