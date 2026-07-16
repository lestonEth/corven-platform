// src/components/common/LoadingScreen.tsx
import { Terminal } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center font-mono text-gray-400 p-6 select-none">
            <div className="max-w-md w-full space-y-4 text-center">
                <div className="inline-flex p-3 bg-gradient-to-br from-[#1f6feb] to-[#58a6ff] rounded-2xl text-white shadow-xl shadow-[#1f6feb]/10 animate-bounce">
                    <Terminal className="h-8 w-8" />
                </div>

                <h2 className="text-white font-bold text-base">
                    Booting FiberDev Studio...
                </h2>

                <div className="w-full bg-[#161b22] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
                    <div className="bg-[#1f6feb] h-full w-2/3 rounded-full animate-pulse" />
                </div>

                <p className="text-[10px] text-gray-500">
                    Restoring your secure development session...
                </p>
            </div>
        </div>
    );
}