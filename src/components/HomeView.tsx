import { ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface HomeViewProps {
  onStartBuilding: () => void;
  activeBlock: number;
}

// ---- content --------------------------------------------------------

const CONFIG_LINES = [
  { code: "[project]", comment: "" },
  { code: 'name     = "hello-ckb"', comment: "matches the workspace folder" },
  { code: 'runtime  = "ckb-rust"', comment: "Rust toolchain with the RISC-V target" },
  { code: 'network  = "devnet"', comment: "isolated local CKB development network" },
  { code: 'build    = "on-save"', comment: "compiles contracts automatically" },
  { code: 'test     = "ckb-debugger"', comment: "runs scripts against mock transactions" },
];

const STEPS = [
  {
    hash: "a3f9c1",
    title: "Open a workspace",
    body: "A complete Rust and CKB development environment starts when the workspace opens.",
  },
  {
    hash: "d82e40",
    title: "Write a contract",
    body: "Build lock scripts and type scripts using Rust with CKB libraries already configured.",
  },
  {
    hash: "9b1c73",
    title: "Compile and debug",
    body: "Compile contracts to RISC-V and inspect script execution using CKB Debugger.",
  },
  {
    hash: "f04a12",
    title: "Test transactions",
    body: "Run contracts against mock cells, witnesses, and transaction inputs before deployment.",
  },
  {
    hash: "221ce8",
    title: "Share your workspace",
    body: "Invite teammates to review code, terminal output, and test results in the browser.",
  },
];

const TERMINAL_LINES = [
  "$ make generate CRATE=hello-world",
  "✓ CKB Rust workspace ready",
  "✓ contract compiled to RISC-V",
  "✓ CKB devnet running",
  "→ workspace opened",
];

const FOOTER_LINKS = {
  Product: ["Workspaces", "Debugger", "Devnet", "Changelog"],
  Resources: ["Docs", "CKB script guide", "Examples"],
  Company: ["About", "Blog", "Contact"],
};

function BrandMark({ size = "sm" }: { size?: "sm" | "md" }) {
  const dims = size === "md" ? "h-9 w-9 text-[15px]" : "h-7 w-7 text-[13px]";
  return (
    <div className={`flex ${dims} items-center justify-center rounded border border-[#3E63DD]/30 bg-[#3E63DD]/10`}>
      <span className="cv-mono font-semibold text-[#7C9BF7]">C</span>
    </div>
  );
}


function CorvenLogo({
  size = 88,
}: {
  size?: number;
}) {
  return (
    <div className="flex flex-col items-center">
      <img
        src="https://res.cloudinary.com/dswyz4vpp/image/upload/v1785082590/ChatGPT_Image_Jul_26__2026__12_57_32_PM-removebg-preview_bjfxlf.png"
        alt="Corven IDE logo"
        width={size}
        height={size}
        className="cv-logo-glow object-contain"
      />


    </div>
  );
}


function TopNav({ onStartBuilding }: { onStartBuilding: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#1B1E23] bg-[#0A0B0D]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-8 py-4 md:px-16">
        <div className="flex items-center gap-2.5">
          <CorvenLogo size={180} />
        </div>

        <nav className="cv-mono hidden items-center gap-8 text-[12px] tracking-wide text-[#8A8F98] md:flex">
          <a href="#workflow" className="transition-colors hover:text-[#F5F3EE]">
            WORKFLOW
          </a>
          <a href="#" className="transition-colors hover:text-[#F5F3EE]">
            DOCS
          </a>
          <a href="#" className="transition-colors hover:text-[#F5F3EE]">
            CHANGELOG
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="#" className="cv-mono hidden text-[12px] text-[#C7C4BC] transition-colors hover:text-[#F5F3EE] sm:inline">
            Sign in
          </a>
          <button
            type="button"
            onClick={onStartBuilding}
            className="cursor-pointer rounded bg-[#3E63DD] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#527AF0] active:scale-[0.98]"
          >
            Open a workspace
          </button>
        </div>
      </div>
    </header>
  );
}

export default function HomeView({ onStartBuilding, activeBlock }: HomeViewProps) {
  const [visibleTerm, setVisibleTerm] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleTerm((previous) => (previous >= TERMINAL_LINES.length ? 1 : previous + 1));
    }, 1300);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0A0B0D] text-[#E7E4DC]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .cv-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .cv-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace; }
        .cv-grid-bg {
          background-image:
            linear-gradient(to right, rgba(231,228,220,0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(231,228,220,0.045) 1px, transparent 1px);
          background-size: 42px 42px;
        }
        @keyframes cv-caret { 0%, 45% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .cv-caret { animation: cv-caret 1s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) { .cv-caret { animation: none; opacity: 1; } }
      `}</style>

      <TopNav onStartBuilding={onStartBuilding} />

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 cv-grid-bg [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]" />

        <div className="relative mx-auto w-full max-w-[1440px] px-8 md:px-16">
          {/* ---------------- Hero ---------------- */}
          <section className="grid grid-cols-1 items-start gap-16 border-b border-[#1B1E23] pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-9 inline-flex items-center gap-2 rounded border border-[#262A30] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1C5]" />
                <span className="cv-mono text-[11px] tracking-wide text-[#8A8F98]">v1.0.4 · build passing</span>
              </div>

              <h1 className="cv-display text-[3.1rem] font-semibold leading-[1.03] tracking-tight text-[#F5F3EE] md:text-7xl">
                Build CKB apps
                <br />
                in the browser.
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#9298A1]">
                Corven is a browser-based development workspace for CKB. Open a workspace and the
                Rust toolchain, contract compiler, debugger, terminal, and local development
                network are already running.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={onStartBuilding}
                  className="cursor-pointer rounded bg-[#3E63DD] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#527AF0] active:scale-[0.98]"
                >
                  Open a workspace
                </button>

                <a
                  href="#workflow"
                  className="cv-mono flex cursor-pointer items-center gap-1.5 text-[13px] text-[#C7C4BC] transition-colors hover:text-[#F5F3EE]"
                >
                  See how it works
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="cv-mono mt-14 flex flex-wrap items-center gap-6 text-[11px] tracking-wide text-[#5C6169]">
                <span>BUILT FOR</span>
                <span className="text-[#8A8F98]">CKB DEVELOPERS</span>
                <span className="text-[#8A8F98]">RUST BUILDERS</span>
                <span className="text-[#8A8F98]">WEB3 TEAMS</span>
              </div>
            </div>

            {/* CKB workspace configuration */}
            <div className="lg:pt-4">
              <div className="flex items-center justify-between border-b border-[#1B1E23] pb-3">
                <span className="cv-mono text-[11px] tracking-wide text-[#5C6169]">corven.toml</span>
                <span className="cv-mono text-[10px] tracking-wide text-[#5C6169]">CKB WORKSPACE</span>
              </div>

              <div className="cv-mono border-l border-[#1B1E23] pl-6 pt-5 text-[13px] leading-8 md:text-[14px]">
                {CONFIG_LINES.map((line, index) => (
                  <div key={index} className="flex flex-wrap gap-x-3">
                    <span className={line.code.startsWith("[") ? "text-[#7C9BF7]" : "text-[#E7E4DC]"}>
                      {line.code}
                    </span>
                    {line.comment && <span className="text-[#5C6169]"># {line.comment}</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- Workflow ---------------- */}
          <section id="workflow" className="border-b border-[#1B1E23] py-20">
            <div className="cv-mono mb-2 text-[11px] tracking-wide text-[#5C6169]">
              FROM ZERO TO A RUNNING CKB CONTRACT
            </div>

            <h2 className="cv-display mb-16 max-w-2xl text-3xl font-semibold text-[#F5F3EE] md:text-4xl">
              What happens from the moment you open a workspace to testing your first CKB
              transaction.
            </h2>

            <div className="relative grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-6">
              <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-[#1B1E23] md:block" />

              {STEPS.map((step) => (
                <div key={step.hash} className="group relative pl-0 md:pt-6">
                  <div className="absolute left-0 top-0 hidden h-[7px] w-[7px] rounded-full bg-[#3E63DD] transition-transform group-hover:scale-125 md:block" />

                  <div className="flex items-baseline gap-3 md:block">
                    <span className="cv-mono text-[12px] text-[#5C6169]">{step.hash}</span>
                    <h3 className="mt-0 text-[15px] font-semibold text-[#F5F3EE] md:mt-2">{step.title}</h3>
                  </div>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#8A8F98]">{step.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- Call to action ---------------- */}
          <section className="grid grid-cols-1 items-center gap-16 border-b border-[#1B1E23] py-20 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="cv-display max-w-md text-3xl font-semibold leading-tight text-[#F5F3EE] md:text-4xl">
                Start building a CKB contract without configuring a local toolchain.
              </h2>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={onStartBuilding}
                  className="flex cursor-pointer items-center gap-2 rounded bg-[#3E63DD] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#527AF0] active:scale-[0.98]"
                >
                  Create workspace
                  <ArrowRight className="h-4 w-4" />
                </button>

                <span className="cv-mono text-[11px] text-[#5C6169]">
                  block #{activeBlock} · free, no card required
                </span>
              </div>
            </div>

            <div className="cv-mono rounded-md border border-[#1B1E23] bg-[#0D0F12] p-6 text-[13px]">
              {TERMINAL_LINES.slice(0, visibleTerm).map((line, index) => {
                const isFirstLine = index === 0;
                const isLatestLine = index === visibleTerm - 1;

                return (
                  <div
                    key={`${line}-${index}`}
                    className={isFirstLine ? "text-[#F5F3EE]" : isLatestLine ? "text-[#4FD1C5]" : "text-[#8A8F98]"}
                  >
                    {line}
                    {isLatestLine && <span className="cv-caret text-[#527AF0]"> ▍</span>}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---------------- Footer ---------------- */}
          <footer className="py-16">
            <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-2.5">
                  <BrandMark />
                  <span className="cv-display text-[15px] font-semibold tracking-tight text-[#F5F3EE]">
                    Corven
                  </span>
                </div>
                <p className="mt-4 max-w-[220px] text-[13px] leading-relaxed text-[#5C6169]">
                  A browser-based development workspace for CKB.
                </p>
              </div>

              {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
                <div key={heading}>
                  <div className="cv-mono text-[11px] tracking-wide text-[#5C6169]">
                    {heading.toUpperCase()}
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-[13px] text-[#8A8F98] transition-colors hover:text-[#F5F3EE]"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-14 flex flex-col gap-3 border-t border-[#1B1E23] pt-6 text-[11px] text-[#5C6169] md:flex-row md:items-center md:justify-between">
              <span className="cv-mono">© {new Date().getFullYear()} Corven</span>
              <span className="cv-mono">block #{activeBlock} · devnet running</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}