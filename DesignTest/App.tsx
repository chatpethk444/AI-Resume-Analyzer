import { useRef, useState } from "react";

type IconProps = { className?: string };

function LogoMark({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#171717" />
      <path d="M10 9.5h8.8l3.2 3.2V23H10V9.5Z" fill="white" />
      <path d="M18.5 9.5v3.7H22M13 16h6M13 19h4.2" stroke="#171717" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function UploadIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m5 10.5 3.1 3L15.5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 10h12m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 3c.4 4.2 2.8 6.6 7 7-4.2.4-6.6 2.8-7 7-.4-4.2-2.8-6.6-7-7 4.2-.4 6.6-2.8 7-7Z" strokeLinejoin="round" />
      <path d="M19 16.5c.15 1.45 1.05 2.35 2.5 2.5-1.45.15-2.35 1.05-2.5 2.5-.15-1.45-1.05-2.35-2.5-2.5 1.45-.15 2.35-1.05 2.5-2.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function MiniScore({ score, color }: { score: number; color: string }) {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
      style={{ background: `conic-gradient(${color} ${score * 3.6}deg, #edf0f4 0)` }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-800">{score}</span>
    </div>
  );
}

export default function App() {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const fileInput = useRef<HTMLInputElement>(null);

  const chooseFile = (file?: File) => {
    if (file) setFileName(file.name);
  };

  const analyze = () => {
    if (!fileName) {
      fileInput.current?.click();
      return;
    }
    setIsAnalyzing(true);
    window.setTimeout(() => setIsAnalyzing(false), 1400);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#171717]">
      <header className="page-enter border-b border-stone-200 bg-[#fafaf9]">
        <nav className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2.5" aria-label="Resumate home">
            <LogoMark />
            <span className="text-[20px] font-bold tracking-[-0.6px]">Resumate</span>
          </a>
          <div className="hidden items-center gap-9 text-[14px] font-medium text-slate-600 md:flex">
            <a className="transition-colors hover:text-slate-950" href="#how-it-works">How it works</a>
            <a className="transition-colors hover:text-slate-950" href="#features">Features</a>
            <a className="transition-colors hover:text-slate-950" href="#resources">Resources</a>
          </div>
          <button className="rounded-full border border-stone-300 px-4 py-2 text-[13px] font-semibold transition hover:border-stone-900">
            Sign in
          </button>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          <div className="relative mx-auto max-w-[1050px]">
            <div className="hero-copy mx-auto max-w-[710px] text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-300 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-stone-600">
                <SparkleIcon className="h-4 w-4" />
                AI-POWERED RESUME ANALYSIS
              </div>
              <h1 className="text-[42px] font-bold leading-[1.08] tracking-[-2.5px] text-stone-950 sm:text-[58px]">
                Make your resume
                <br />
                impossible to ignore.
              </h1>
              <p className="mx-auto mt-5 max-w-[580px] text-[16px] leading-7 text-slate-600">
                Get an instant, expert-level review of your resume. See exactly what&apos;s working, what isn&apos;t, and how to fix it.
              </p>
            </div>

            <div
              className="upload-stage relative mx-auto mt-12 max-w-[720px]"
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                setTilt({
                  x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -5,
                  y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 7,
                });
              }}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <div className="paper-layer paper-layer-one" aria-hidden="true" />
              <div className="paper-layer paper-layer-two" aria-hidden="true" />
              <div
                className="upload-card relative z-10 rounded-2xl border border-stone-200 bg-white p-3 sm:p-4"
                style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(18px)` }}
              >
              <div
                className={`rounded-xl border-2 border-dashed px-5 py-9 text-center transition sm:px-8 sm:py-10 ${
                  isDragging ? "border-stone-900 bg-stone-50" : "border-stone-200 bg-white"
                }`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  chooseFile(event.dataTransfer.files[0]);
                }}
              >
                <input
                  ref={fileInput}
                  className="hidden"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => chooseFile(event.target.files?.[0])}
                />
                <div className="upload-icon mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                  <UploadIcon />
                </div>
                <p className="text-[15px] font-semibold text-slate-900">
                  {fileName || "Drop your resume here"}
                </p>
                <p className="mt-1.5 text-[13px] text-slate-500">
                  {fileName ? "Ready for your free analysis" : "or click to browse from your computer"}
                </p>
                <button
                  onClick={() => fileInput.current?.click()}
                  className="mt-5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                >
                  {fileName ? "Choose another file" : "Choose file"}
                </button>
                <p className="mt-4 text-[11px] text-slate-400">PDF, DOC, or DOCX • Max 10MB • Your data stays private</p>
              </div>
              <button
                onClick={analyze}
                disabled={isAnalyzing}
                  className={`analyze-button mt-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-stone-950 py-3.5 text-[14px] font-semibold text-white transition hover:bg-stone-800 disabled:cursor-wait disabled:opacity-70 ${isAnalyzing ? "is-analyzing" : ""}`}
              >
                {isAnalyzing ? "Analyzing your resume..." : "Check my resume — it’s free"}
                {!isAnalyzing && <ArrowIcon />}
              </button>
              </div>
            </div>

            <div className="trust-row mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[12px] font-medium text-slate-500">
              {["No credit card", "Instant results", "100% confidential"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-stone-200 bg-white px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[1080px]">
            <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[1.8px] text-stone-500">Your complete review</span>
                <h2 className="mt-3 text-[32px] font-bold leading-tight tracking-[-1.2px] sm:text-[38px]">Know exactly where your resume stands.</h2>
                <p className="mt-4 text-[15px] leading-7 text-slate-600">
                  We scan your resume across the same criteria recruiters and hiring systems use, then turn every insight into a clear next step.
                </p>
                <div className="mt-7 space-y-4">
                  {[
                    ["ATS compatibility", "Make it past automated screening"],
                    ["Content & impact", "Turn responsibilities into results"],
                    ["Formatting & clarity", "Keep every detail easy to scan"],
                  ].map(([title, detail]) => (
                    <div key={title} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold">{title}</p>
                        <p className="mt-0.5 text-[13px] text-slate-500">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="report-stage rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-6">
                <div className="report-card rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-slate-400">Resume score</p>
                      <p className="mt-1 text-[15px] font-semibold">Marketing Manager.pdf</p>
                    </div>
                    <div className="score-ring relative flex h-20 w-20 items-center justify-center rounded-full bg-[conic-gradient(#171717_306deg,#e7e5e4_0)]">
                      <div className="flex h-[62px] w-[62px] flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-[22px] font-bold leading-none">85</span>
                        <span className="mt-1 text-[9px] font-semibold text-slate-400">GREAT</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      ["ATS readiness", 92, "#20a67a"],
                      ["Content", 84, "#245ff5"],
                      ["Structure", 78, "#e7a52c"],
                      ["Writing", 88, "#8b5cf6"],
                    ].map(([label, score, color]) => (
                      <div key={label as string} className="score-item flex items-center gap-3 rounded-lg border border-slate-100 bg-[#fbfcfd] p-3">
                        <MiniScore score={score as number} color={color as string} />
                        <div>
                          <p className="text-[12px] font-semibold text-slate-700">{label}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">Strong result</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3.5">
                    <p className="flex items-center gap-2 text-[12px] font-semibold text-stone-900">
                      <SparkleIcon className="h-4 w-4 text-stone-600" />
                      Top recommendation
                    </p>
                    <p className="mt-1.5 text-[11px] leading-5 text-stone-500">Add measurable outcomes to your two most recent work experiences.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-4 text-[12px] text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <LogoMark className="h-6 w-6" />
            <span className="font-semibold text-slate-600">Resumate</span>
          </div>
          <p>Built to help every great candidate get noticed.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-slate-700">Privacy</a>
            <a href="#" className="hover:text-slate-700">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
