// src/components/IdeView.tsx
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  AlertCircle,
  Check,
  ChevronDown,
  FileCode,
  Folder,
  GitBranch,
  Play,
  RefreshCw,
  Save,
  Search,
  Send,
  Sparkles,
} from 'lucide-react';

import type { VirtualFile } from '../types';

export type IdePanel =
  | 'files'
  | 'search'
  | 'git'
  | 'debug';

interface IdeViewProps {
  files: VirtualFile[];

  activePanel: IdePanel;

  isLoadingFiles: boolean;

  onRefreshFiles: () => Promise<void>;

  onSaveFile: (
    path: string,
    content: string,
  ) => Promise<void>;

  onDeploy: () => Promise<void> | void;

  isDeploying: boolean;

  activeBlock: number;

  nodeStatus: string;

  terminalLogs: string[];
}

type BottomPanel =
  | 'terminal'
  | 'debug'
  | 'output'
  | 'problems';

export default function IdeView({
  files,
  activePanel,
  isLoadingFiles,
  onRefreshFiles,
  onSaveFile,
  onDeploy,
  isDeploying,
  activeBlock,
  nodeStatus,
  terminalLogs,
}: IdeViewProps) {
  const [activeFilePath, setActiveFilePath] =
    useState(() => files[0]?.path ?? '');

  const [editorContent, setEditorContent] =
    useState('');

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveSuccess, setSaveSuccess] =
    useState(false);

  const [activeBottomPanel, setActiveBottomPanel] =
    useState<BottomPanel>('terminal');

  const [terminalInput, setTerminalInput] =
    useState('');

  const [terminalOutput, setTerminalOutput] =
    useState<string[]>([]);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [aiPrompt, setAiPrompt] =
    useState('');

  const [aiResponse, setAiResponse] =
    useState('');

  const [isAiLoading, setIsAiLoading] =
    useState(false);

  const terminalBottomRef =
    useRef<HTMLDivElement>(null);

  const currentFile = useMemo(
    () =>
      files.find(
        (file) => file.path === activeFilePath,
      ) ?? files[0],
    [activeFilePath, files],
  );

  useEffect(() => {
    if (!activeFilePath && files.length > 0) {
      setActiveFilePath(files[0].path);
    }
  }, [activeFilePath, files]);

  useEffect(() => {
    if (currentFile) {
      setEditorContent(currentFile.content);
    }
  }, [currentFile]);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [
    terminalOutput,
    terminalLogs,
    activeBottomPanel,
  ]);

  const groupedFiles = useMemo(
    () => ({
      contracts: files.filter((file) =>
        file.path.startsWith('contracts/'),
      ),

      src: files.filter((file) =>
        file.path.startsWith('src/'),
      ),

      tests: files.filter((file) =>
        file.path.startsWith('tests/'),
      ),

      config: files.filter(
        (file) => !file.path.includes('/'),
      ),
    }),
    [files],
  );

  const searchResults = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return [];
    }

    return files.filter(
      (file) =>
        file.name
          .toLowerCase()
          .includes(query) ||
        file.path
          .toLowerCase()
          .includes(query) ||
        file.content
          .toLowerCase()
          .includes(query),
    );
  }, [files, searchQuery]);

  const handleSave = async () => {
    if (!currentFile) {
      return;
    }

    setIsSaving(true);

    try {
      await onSaveFile(
        currentFile.path,
        editorContent,
      );

      setSaveSuccess(true);

      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTerminalSubmit = (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const command = terminalInput.trim();

    if (!command) {
      return;
    }

    if (command === 'clear') {
      setTerminalOutput([]);
      setTerminalInput('');
      return;
    }

    setTerminalOutput((current) => [
      ...current,
      `root@fiber-runtime:/workspace# ${command}`,
      `Command queued: ${command}`,
    ]);

    setTerminalInput('');
  };

  const handleAiSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (!aiPrompt.trim()) {
      return;
    }

    setIsAiLoading(true);

    try {
      const response = await fetch(
        '/api/ai/chat',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            prompt: aiPrompt,
            currentFile:
              currentFile?.path ?? null,
            fileContent: editorContent,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          'AI assistant is unavailable',
        );
      }

      const data = await response.json();

      setAiResponse(
        data.response ??
        'No response was returned.',
      );
    } catch (error) {
      setAiResponse(
        error instanceof Error
          ? error.message
          : 'AI request failed',
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderFileGroup = (
    label: string,
    groupFiles: VirtualFile[],
  ) => {
    if (groupFiles.length === 0) {
      return null;
    }

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-gray-400">
          <ChevronDown className="h-3.5 w-3.5" />

          <Folder className="h-4 w-4 text-[#58a6ff]" />

          <span>{label}</span>
        </div>

        <div className="space-y-0.5 pl-5">
          {groupFiles.map((file) => (
            <button
              type="button"
              key={file.path}
              onClick={() =>
                setActiveFilePath(file.path)
              }
              className={`flex w-full items-center gap-2 rounded border-l-2 px-2 py-1 text-left font-mono text-xs ${activeFilePath === file.path
                ? 'border-[#1f6feb] bg-[#1f6feb]/10 text-[#58a6ff]'
                : 'border-transparent text-gray-400 hover:bg-gray-800/30 hover:text-gray-200'
                }`}
            >
              <FileCode className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">
                {file.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSidebarPanel = () => {
    if (activePanel === 'search') {
      return (
        <>
          <PanelHeader title="Search" />

          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />

              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value,
                  )
                }
                placeholder="Search workspace..."
                className="w-full rounded border border-[#30363d] bg-[#0d1117] py-2 pl-9 pr-3 text-xs text-gray-200 outline-none focus:border-[#58a6ff]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            {!searchQuery && (
              <p className="p-3 text-xs text-gray-500">
                Search filenames, paths, and
                source code.
              </p>
            )}

            {searchQuery &&
              searchResults.length === 0 && (
                <p className="p-3 text-xs text-gray-500">
                  No matching files found.
                </p>
              )}

            {searchResults.map((file) => (
              <button
                type="button"
                key={file.path}
                onClick={() =>
                  setActiveFilePath(file.path)
                }
                className="mb-1 flex w-full items-start gap-2 rounded px-2 py-2 text-left hover:bg-gray-800/30"
              >
                <FileCode className="mt-0.5 h-4 w-4 shrink-0 text-[#58a6ff]" />

                <span className="min-w-0">
                  <span className="block truncate text-xs text-gray-200">
                    {file.name}
                  </span>

                  <span className="block truncate font-mono text-[10px] text-gray-500">
                    {file.path}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </>
      );
    }

    if (activePanel === 'git') {
      return (
        <>
          <PanelHeader title="Source Control" />

          <div className="flex-1 space-y-4 p-4">
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                <GitBranch className="h-4 w-4 text-[#58a6ff]" />
                main
              </div>

              <p className="mt-2 text-[11px] text-gray-500">
                No uncommitted changes.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="w-full rounded-lg border border-[#30363d] bg-[#21262d] py-2 text-xs text-gray-500"
            >
              Commit changes
            </button>
          </div>
        </>
      );
    }

    if (activePanel === 'debug') {
      return (
        <>
          <PanelHeader title="Run & Debug" />

          <div className="flex-1 space-y-4 p-4">
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-200">
                  Runtime
                </span>

                <span
                  className={`text-[10px] ${nodeStatus === 'Operational'
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                    }`}
                >
                  {nodeStatus}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void onDeploy()}
              disabled={isDeploying}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#238636] py-2 text-xs font-semibold text-white hover:bg-[#2ea043] disabled:opacity-50"
            >
              <Play className="h-4 w-4" />

              {isDeploying
                ? 'Deploying...'
                : 'Run Workspace'}
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex h-11 items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">
            Explorer
          </span>

          <button
            type="button"
            title="Refresh files"
            onClick={() =>
              void onRefreshFiles()
            }
            disabled={isLoadingFiles}
            className="rounded p-1 text-gray-500 hover:bg-gray-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoadingFiles
                ? 'animate-spin'
                : ''
                }`}
            />
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto px-2 py-3">
          {renderFileGroup(
            'contracts',
            groupedFiles.contracts,
          )}

          {renderFileGroup(
            'src',
            groupedFiles.src,
          )}

          {renderFileGroup(
            'tests',
            groupedFiles.tests,
          )}

          {renderFileGroup(
            'config',
            groupedFiles.config,
          )}
        </div>

        <div className="border-t border-[#30363d] p-4 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Block:</span>

            <span className="font-mono font-bold text-[#58a6ff]">
              #{activeBlock}
            </span>
          </div>

          <div className="mt-1 flex justify-between text-gray-400">
            <span>Status:</span>

            <span className="font-mono text-emerald-400">
              {nodeStatus}
            </span>
          </div>
        </div>
      </>
    );
  };

  if (!currentFile) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0d1117] text-sm text-gray-500">
        No workspace files are available.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0d1117] text-gray-200">
      <aside className="flex w-64 shrink-0 flex-col border-r border-[#30363d] bg-[#161b22]">
        {renderSidebarPanel()}
      </aside>

      <section className="flex min-w-0 flex-1 flex-col bg-[#0d1117]">
        <div className="flex h-11 items-center border-b border-[#30363d] bg-[#161b22]">
          <div className="flex h-full items-center gap-2 border-r border-[#30363d] border-t-2 border-t-[#1f6feb] bg-[#0d1117] px-4 text-[#58a6ff]">
            <FileCode className="h-3.5 w-3.5" />

            <span className="font-mono text-xs font-semibold">
              {currentFile.name}
            </span>
          </div>
        </div>

        <div className="flex h-9 items-center justify-between border-b border-[#30363d]/60 px-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-1 font-mono">
            <span>WORKSPACE</span>

            {currentFile.path
              .split('/')
              .map((part, index, parts) => (
                <span key={`${part}-${index}`}>
                  {' > '}

                  <span
                    className={
                      index === parts.length - 1
                        ? 'font-semibold text-gray-300'
                        : ''
                    }
                  >
                    {part}
                  </span>
                </span>
              ))}
          </div>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving}
            className={`flex items-center gap-1 rounded border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-gray-300 hover:bg-[#30363d] disabled:opacity-50 ${saveSuccess
              ? 'border-emerald-500/50 text-emerald-400'
              : ''
              }`}
          >
            {saveSuccess ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                {isSaving
                  ? 'Saving...'
                  : 'Save'}
              </>
            )}
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="w-12 select-none overflow-hidden border-r border-gray-800/50 pt-4 pr-3 text-right font-mono text-[11px] leading-[1.6] text-gray-600">
            {editorContent
              .split('\n')
              .map((_, index) => (
                <div key={index}>
                  {index + 1}
                </div>
              ))}
          </div>

          <textarea
            value={editorContent}
            onChange={(event) =>
              setEditorContent(
                event.target.value,
              )
            }
            spellCheck={false}
            className="h-full flex-1 resize-none overflow-y-auto bg-transparent p-4 font-mono text-xs leading-[1.6] text-gray-300 outline-none"
            style={{ tabSize: 2 }}
          />
        </div>

        <div className="flex h-52 shrink-0 flex-col border-t border-[#30363d] bg-[#161b22]">
          <div className="flex h-9 items-center gap-5 border-b border-[#30363d] bg-[#0d1117] px-4 font-mono text-[11px] font-bold">
            {(
              [
                'terminal',
                'debug',
                'output',
                'problems',
              ] as BottomPanel[]
            ).map((panel) => (
              <button
                type="button"
                key={panel}
                onClick={() =>
                  setActiveBottomPanel(panel)
                }
                className={`h-full border-b-2 px-1 uppercase ${activeBottomPanel === panel
                  ? 'border-[#1f6feb] text-[#58a6ff]'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
              >
                {panel}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto bg-[#0d1117] p-4 font-mono text-xs">
            {activeBottomPanel ===
              'terminal' && (
                <div>
                  <div className="mb-2 text-gray-500">
                    FiberDev runtime terminal
                  </div>

                  {terminalOutput.map(
                    (line, index) => (
                      <div
                        key={index}
                        className="whitespace-pre-wrap text-gray-300"
                      >
                        {line}
                      </div>
                    ),
                  )}

                  <form
                    onSubmit={
                      handleTerminalSubmit
                    }
                    className="mt-1 flex items-center gap-2"
                  >
                    <span className="text-[#58a6ff]">
                      $
                    </span>

                    <input
                      value={terminalInput}
                      onChange={(event) =>
                        setTerminalInput(
                          event.target.value,
                        )
                      }
                      placeholder="Enter command..."
                      className="flex-1 bg-transparent text-white outline-none"
                    />
                  </form>
                </div>
              )}

            {activeBottomPanel ===
              'debug' && (
                <div className="text-amber-300">
                  Debugger is not attached.
                </div>
              )}

            {activeBottomPanel ===
              'output' && (
                <div className="space-y-1">
                  {terminalLogs.length === 0 ? (
                    <span className="text-gray-500">
                      No runtime output.
                    </span>
                  ) : (
                    terminalLogs
                      .slice(-20)
                      .map((line, index) => (
                        <div
                          key={index}
                          className="text-gray-300"
                        >
                          {line}
                        </div>
                      ))
                  )}
                </div>
              )}

            {activeBottomPanel ===
              'problems' && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="h-4 w-4" />
                  No problems detected.
                </div>
              )}

            <div ref={terminalBottomRef} />
          </div>
        </div>
      </section>

      <aside className="flex w-80 shrink-0 flex-col border-l border-[#30363d] bg-[#161b22]">
        <div className="flex h-11 items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-4">
          <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#58a6ff]">
            <Sparkles className="h-4 w-4" />
            AI Assistant
          </span>

          <span className="rounded border border-[#1f6feb]/20 bg-[#1f6feb]/10 px-2 py-0.5 font-mono text-[10px] text-[#58a6ff]">
            Preview
          </span>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#0d1117]/60 p-4 text-xs">
          {isAiLoading ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Thinking...
            </div>
          ) : aiResponse ? (
            <div className="whitespace-pre-wrap rounded-lg border border-[#30363d] bg-[#161b22] p-3 text-gray-300">
              {aiResponse}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-500">
              <Sparkles className="h-10 w-10 text-gray-700" />

              <p className="max-w-[220px]">
                Ask questions about the active
                workspace file.
              </p>
            </div>
          )}
        </div>

        <form
          onSubmit={handleAiSubmit}
          className="flex items-center gap-2 border-t border-[#30363d] p-3"
        >
          <input
            value={aiPrompt}
            onChange={(event) =>
              setAiPrompt(event.target.value)
            }
            placeholder="Ask the assistant..."
            className="flex-1 rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-xs text-gray-200 outline-none focus:border-[#1f6feb]"
          />

          <button
            type="submit"
            disabled={
              !aiPrompt.trim() || isAiLoading
            }
            className="rounded bg-[#1f6feb] p-2 text-white hover:bg-[#388bfd] disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </aside>
    </div>
  );
}

function PanelHeader({
  title,
}: {
  title: string;
}) {
  return (
    <div className="flex h-11 items-center border-b border-[#30363d] bg-[#0d1117] px-4 sticky-top">
      <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">
        {title}
      </span>
    </div>
  );
}