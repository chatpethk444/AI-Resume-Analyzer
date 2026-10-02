'use client';

import { useRef, useState } from 'react';
import ResultsDashboard from '@/components/ResultsDashboard';
import { createClient } from '@/utils/supabase/client';
import { Textarea } from '@/components/ui/textarea';

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

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const fileInput = useRef<HTMLInputElement>(null);
  
  const supabase = createClient();

  const chooseFile = (selectedFile?: File) => {
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('กรุณาอัปโหลดไฟล์ PDF เท่านั้น');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) {
      setError('กรุณาอัปโหลดเรซูเม่ (PDF) และใส่รายละเอียดงาน (JD) ให้ครบถ้วน');
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jd', jd);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'การวิเคราะห์ล้มเหลว กรุณาลองใหม่อีกครั้ง');
      }

      const data = await res.json();
      setResults(data.analysis);

      // Save to Supabase
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id || null;

      const { data: resumeRecord, error: resumeErr } = await supabase
        .from('resumes')
        .insert({ user_id: userId, file_name: file.name, parsed_text: data.parsed_text })
        .select()
        .single();

      if (!resumeErr && resumeRecord) {
        const { data: analysisRecord } = await supabase
          .from('analyses')
          .insert({
            user_id: userId,
            resume_id: resumeRecord.id,
            job_description: jd,
            match_score: data.analysis.match_score,
            ai_feedback: data.analysis,
            is_guest: !userId
          })
          .select()
          .single();

        if (!userId && analysisRecord) {
          const existingGuests = JSON.parse(localStorage.getItem('guest_analyses') || '[]');
          existingGuests.push(analysisRecord.id);
          localStorage.setItem('guest_analyses', JSON.stringify(existingGuests));
        }
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดบางอย่าง');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (results) {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-[#171717] font-sans selection:bg-stone-300">
        <header className="border-b border-stone-200 bg-white">
          <nav className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-2.5" onClick={() => setResults(null)} style={{cursor: 'pointer'}}>
              <LogoMark />
              <span className="text-[20px] font-bold tracking-[-0.6px]">AI Resume Analyzer</span>
            </div>
            <button onClick={() => setResults(null)} className="rounded-full border border-stone-300 px-4 py-2 text-[13px] font-semibold transition hover:border-stone-900 bg-white">
              วิเคราะห์เรซูเม่ใหม่
            </button>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto space-y-6 p-6 pt-12">
          <div className="flex flex-col text-center items-center justify-center mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-300 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-emerald-600 bg-emerald-50">
              <SparkleIcon className="h-4 w-4" />
              วิเคราะห์เสร็จสมบูรณ์
            </div>
            <h1 className="text-3xl font-bold text-stone-900">
              ผลประเมินความเข้ากันได้ระหว่างเรซูเม่และงานของคุณ
            </h1>
          </div>
          <ResultsDashboard data={results} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#171717]">
      <header className="page-enter border-b border-stone-200 bg-[#fafaf9]">
        <nav className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2.5" aria-label="Resumate home">
            <LogoMark />
            <span className="text-[20px] font-bold tracking-[-0.6px]">AI Resume Analyzer</span>
          </a>
          <button className="rounded-full border border-stone-300 px-4 py-2 text-[13px] font-semibold transition hover:border-stone-900">
            เข้าสู่ระบบ
          </button>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          <div className="relative mx-auto max-w-[1050px]">
            <div className="hero-copy mx-auto max-w-[710px] text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-300 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-stone-600 bg-white shadow-sm">
                <SparkleIcon className="h-4 w-4" />
                AI-POWERED RESUME ANALYSIS
              </div>
              <h1 className="text-[42px] font-bold leading-[1.08] tracking-[-2.5px] text-stone-950 sm:text-[58px]">
                ทำให้เรซูเม่ของคุณ
                <br />
                โดดเด่นจนปฏิเสธไม่ได้
              </h1>
              <p className="mx-auto mt-5 max-w-[580px] text-[16px] leading-7 text-slate-600">
                อัปโหลดเรซูเม่และรายละเอียดงาน เพื่อรับการประเมินจากผู้เชี่ยวชาญ (AI) ทันที ค้นพบจุดแข็ง จุดอ่อน และวิธีปรับแก้ให้ผ่านระบบคัดกรอง ATS ได้อย่างง่ายดาย
              </p>
            </div>

            {error && (
              <div className="mt-8 max-w-[720px] mx-auto p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-center text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div
              className="upload-stage relative mx-auto mt-8 max-w-[720px]"
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                setTilt({
                  x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -3,
                  y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 5,
                });
              }}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <div className="paper-layer paper-layer-one" aria-hidden="true" />
              <div className="paper-layer paper-layer-two" aria-hidden="true" />
              
              <div
                className="upload-card relative z-10 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 flex flex-col gap-4 shadow-xl"
                style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(18px)` }}
              >
                {/* Upload Area */}
                <div
                  className={`rounded-xl border-2 border-dashed px-5 py-8 text-center transition sm:px-8 sm:py-9 ${
                    isDragging ? "border-stone-900 bg-stone-50" : (file ? "border-emerald-500 bg-emerald-50/30" : "border-stone-200 bg-white hover:border-stone-400")
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
                    accept=".pdf"
                    onChange={(event) => chooseFile(event.target.files?.[0])}
                  />
                  {file ? (
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckIcon className="h-6 w-6" />
                      </div>
                      <p className="text-[15px] font-semibold text-slate-900">
                        {file.name}
                      </p>
                      <p className="mt-1 text-[13px] text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="mt-3 text-[13px] font-semibold text-red-500 hover:text-red-700 transition"
                      >
                        ลบไฟล์
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                        <UploadIcon />
                      </div>
                      <p className="text-[15px] font-semibold text-slate-900">
                        ลากและวางไฟล์เรซูเม่ (PDF) ที่นี่
                      </p>
                      <p className="mt-1.5 text-[13px] text-slate-500">
                        เตรียมพร้อมรับการประเมินวิเคราะห์ฟรี
                      </p>
                      <button
                        onClick={() => fileInput.current?.click()}
                        className="mt-5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        เลือกไฟล์ PDF
                      </button>
                      <p className="mt-4 text-[11px] text-slate-400">PDF เท่านั้น • ขนาดสูงสุด 2MB • ข้อมูลของคุณจะถูกเก็บเป็นความลับ</p>
                    </>
                  )}
                </div>

                {/* JD Area */}
                <div className="flex flex-col bg-stone-50 rounded-xl p-4 border border-stone-200">
                  <label className="text-[13px] font-bold text-stone-700 mb-2 flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 text-stone-700 text-[11px]">JD</span>
                    รายละเอียดงาน (Job Description)
                  </label>
                  <Textarea
                    placeholder="วางข้อกำหนดและรายละเอียดงานทั้งหมดที่นี่ (แนะนำอย่างน้อย 50 คำ)..."
                    className="min-h-[140px] resize-none bg-white border-stone-200 text-stone-800 placeholder:text-stone-400 text-[14px] focus-visible:ring-stone-400 shadow-sm"
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                  />
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !file || !jd.trim()}
                  className={`analyze-button mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-stone-950 py-3.5 text-[15px] font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 ${isAnalyzing ? "is-analyzing" : ""}`}
                >
                  {isAnalyzing ? "กำลังวิเคราะห์เรซูเม่ของคุณ..." : "วิเคราะห์ความเข้ากันได้ — ฟรี"}
                  {!isAnalyzing && <ArrowIcon />}
                </button>
              </div>
            </div>

            <div className="trust-row mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[12px] font-medium text-slate-500">
              {["ไม่ต้องใช้บัตรเครดิต", "รู้ผลทันที", "ข้อมูลเป็นความลับ 100%"].map((item) => (
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
      </main>

      <footer className="bg-white px-5 py-7 sm:px-8 border-t border-stone-200 mt-20">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-4 text-[13px] text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <LogoMark className="h-6 w-6" />
            <span className="font-semibold text-slate-700">AI Resume Analyzer</span>
          </div>
          <p>สร้างขึ้นเพื่อช่วยให้ผู้สมัครงานทุกคนโดดเด่นและถูกเรียกสัมภาษณ์</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-slate-900 transition-colors">ความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-slate-900 transition-colors">เงื่อนไขการใช้งาน</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
