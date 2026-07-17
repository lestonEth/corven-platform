import { useState } from "react";
import { Terminal, Settings, User, Search, Sparkles, LogOut, ChevronDown, Github } from "lucide-react";

interface HeaderProps {
  activeView: 'home' | 'dashboard' | 'ide' | 'nodes';
  setActiveView: (view: 'home' | 'dashboard' | 'ide' | 'nodes') => void;
  nodeStatus: string;
  onDeploy: () => void;
  isDeploying: boolean;
  user: { email: string; username: string; avatar: string; provider: string } | null;
  onLogout: () => void;
}

export default function Header({
  activeView,
  setActiveView,
  nodeStatus,
  onDeploy,
  isDeploying,
  user,
  onLogout
}: HeaderProps) {

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <header className="bg-[#161b22] border-b border-[#30363d] flex justify-between items-center w-full px-6 h-14 z-50 fixed top-0 select-none">
      <div className="flex items-center gap-8">
        <div
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-[#1f6feb] p-1.5 rounded text-white shadow-lg shadow-primary-container/20 group-hover:scale-105 transition-transform">
            <Terminal className="h-5 w-5" />
          </div>
          <span className="font-headline-sm text-lg font-black tracking-tight text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            FiberDev <span className="text-[#58a6ff]">Studio</span>
          </span>
        </div>

        <nav className="hidden md:flex gap-1">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`font-body-sm text-sm px-3 py-1.5 rounded transition-all ${activeView === 'dashboard'
                ? 'text-[#58a6ff] bg-[#30363d]/50 font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('ide')}
            className={`font-body-sm text-sm px-3 py-1.5 rounded transition-all ${activeView === 'ide'
                ? 'text-[#58a6ff] bg-[#30363d]/50 font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
          >
            Workspace IDE
          </button>
          <button
            onClick={() => setActiveView('nodes')}
            className={`font-body-sm text-sm px-3 py-1.5 rounded transition-all ${activeView === 'nodes'
                ? 'text-[#58a6ff] bg-[#30363d]/50 font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
          >
            Node Manager
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Simple global status indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-[#0d1117] border border-[#30363d] px-3 py-1 rounded-full text-xs">
          <span className={`w-2 h-2 rounded-full ${nodeStatus === 'Operational' ? 'bg-emerald-500 animate-pulse' :
              nodeStatus === 'Restarting' ? 'bg-amber-500 animate-spin' :
                nodeStatus === 'Resetting' ? 'bg-rose-500 animate-pulse' : 'bg-sky-400 animate-pulse'
            }`} />
          <span className="text-gray-400">Node status: <span className="text-white font-medium capitalize">{nodeStatus}</span></span>
        </div>

        {/* Global workspace Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-500" />
          <input
            className="bg-[#0d1117] border border-[#30363d] rounded px-9 py-1 text-xs focus:outline-none focus:border-[#58a6ff] w-60 h-8 font-mono text-gray-300 placeholder-gray-500"
            placeholder="Search files, symbols..."
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setActiveView('ide');
              }
            }}
          />
        </div>

        {/* Deploy Quick Action Button */}
        <button
          onClick={onDeploy}
          disabled={isDeploying || nodeStatus !== 'Operational'}
          className={`bg-[#238636] text-white px-4 h-8 rounded text-xs font-semibold hover:bg-[#2ea043] disabled:opacity-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg ${isDeploying ? 'shadow-amber-500/10' : 'shadow-primary/10'
            }`}
        >
          {isDeploying ? (
            <>
              <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3" />
              Deploy Node
            </>
          )}
        </button>

        {/* Account Profile with dropdown */}
        <div className="flex gap-2 border-l border-[#30363d] pl-3 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-[#21262d] px-2 py-1 rounded-xl transition-all border border-transparent hover:border-[#30363d]"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-6 w-6 rounded-full border border-[#30363d] bg-[#0d1117]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="h-6 w-6 text-[#58a6ff]" />
                )}
                <span className="hidden md:inline font-mono text-xs text-gray-300 font-semibold max-w-[100px] truncate">
                  {user.username}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2.5 w-64 bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl p-4 space-y-3 z-[999] animate-fade-in">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#30363d]/50">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-10 w-10 rounded-full border border-[#30363d]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-xs font-bold text-white truncate">
                        {user.username}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate mt-0.5">
                        {user.email}
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        {user.provider === 'github' ? (
                          <span className="inline-flex items-center gap-1 text-[8px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/20 font-bold font-mono">
                            <Github className="h-2 w-2" />
                            GitHub Verified
                          </span>
                        ) : user.provider === 'credentials' ? (
                          <span className="inline-flex items-center gap-1 text-[8px] bg-[#58a6ff]/10 text-[#58a6ff] px-1.5 py-0.5 rounded border border-[#58a6ff]/20 font-bold font-mono">
                            Email Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[8px] bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/20 font-bold font-mono">
                            Guest Account
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveView('dashboard');
                        setShowDropdown(false);
                      }}
                      className="w-full text-left font-mono text-[11px] text-gray-400 hover:text-white py-1.5 px-2 rounded-lg hover:bg-gray-800/40 transition-colors flex items-center gap-2"
                    >
                      <User className="h-3.5 w-3.5" />
                      View Profile Stats
                    </button>
                    <button
                      className="w-full text-left font-mono text-[11px] text-gray-400 hover:text-white py-1.5 px-2 rounded-lg hover:bg-gray-800/40 transition-colors flex items-center gap-2"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Workspace Settings
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#30363d]/50">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left font-mono text-[11px] text-rose-400 hover:text-rose-300 py-1.5 px-2 rounded-lg hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="text-gray-400 hover:text-[#58a6ff] p-1.5 hover:bg-gray-800/30 rounded transition-colors"
            >
              <User className="h-4.5 w-4.5" />
            </button>
          )}
          <button
            title="Settings"
            className="text-gray-400 hover:text-[#58a6ff] p-1.5 hover:bg-gray-800/30 rounded transition-colors"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
