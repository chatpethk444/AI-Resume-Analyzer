import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

interface Recommendation {
  original: string;
  improved: string;
  reasoning: string;
}

interface ResultsDashboardProps {
  data: {
    match_score: number;
    strengths: string[];
    weaknesses: string[];
    keywords: {
      matched: string[];
      missing: string[];
    };
    recommendations: Recommendation[];
  };
}

export default function ResultsDashboard({ data }: ResultsDashboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreStroke = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 60) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Row: Score & Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white border-stone-200 shadow-sm md:col-span-1 flex flex-col justify-center items-center p-8 relative overflow-hidden">
          <h3 className="text-stone-500 text-sm font-semibold uppercase tracking-wider mb-4">ความเข้ากันได้โดยรวม</h3>
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Simple radial representation using border */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="stroke-stone-100" strokeWidth="8" fill="none" />
              <circle 
                cx="50" cy="50" r="45" 
                className={`${getScoreStroke(data.match_score)} transition-all duration-1000 ease-out`} 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * data.match_score) / 100}
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(data.match_score)}`}>{data.match_score}%</span>
            </div>
          </div>
        </Card>

        <Card className="bg-white border-stone-200 shadow-sm md:col-span-2 overflow-hidden flex flex-col">
          <CardHeader className="border-b border-stone-100 bg-stone-50/50 pb-4">
            <CardTitle className="text-[17px] flex items-center gap-2 text-stone-800">
              Keyword Analysis (วิเคราะห์คีย์เวิร์ด)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid md:grid-cols-2 gap-6 flex-1">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                คีย์เวิร์ดที่ตรงกัน
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.keywords.matched.map((kw, i) => (
                  <Badge key={i} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2 py-1 shadow-sm font-medium">
                    {kw}
                  </Badge>
                ))}
                {data.keywords.matched.length === 0 && <span className="text-[13px] text-stone-500">ไม่พบข้อมูล</span>}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                คีย์เวิร์ดที่ขาดหาย
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.keywords.missing.map((kw, i) => (
                  <Badge key={i} variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 px-2 py-1 shadow-sm font-medium">
                    {kw}
                  </Badge>
                ))}
                {data.keywords.missing.length === 0 && <span className="text-[13px] text-stone-500">ครบถ้วน!</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row: Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white border-stone-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-stone-100 bg-stone-50/50">
            <CardTitle className="text-[17px] text-emerald-600 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> จุดแข็ง (Strengths)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {data.strengths.map((str, i) => (
                <li key={i} className="text-[14px] text-stone-700 flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-500 mt-1">•</span> {str}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-stone-100 bg-stone-50/50">
            <CardTitle className="text-[17px] text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> จุดอ่อนที่ควรปรับปรุง (Weaknesses)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {data.weaknesses.map((weak, i) => (
                <li key={i} className="text-[14px] text-stone-700 flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-500 mt-1">•</span> {weak}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: AI Recommendations */}
      <Card className="bg-white border-stone-200 shadow-sm">
        <CardHeader className="border-b border-stone-100 bg-stone-50/50">
          <CardTitle className="text-[17px] text-stone-800 flex items-center gap-2">
            <SparkleIcon className="h-5 w-5 text-indigo-500" />
            คำแนะนำและเกลาประโยคโดย AI
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-stone-100">
          {data.recommendations.map((rec, i) => (
            <div key={i} className="p-6 hover:bg-stone-50/50 transition-colors">
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full inline-block">ก่อนแก้ (Before)</span>
                  <p className="text-[14px] text-stone-500 line-through decoration-rose-300 leading-relaxed">{rec.original}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full inline-block">หลังแก้ (After)</span>
                  <p className="text-[14px] text-stone-800 font-medium leading-relaxed">{rec.improved}</p>
                </div>
              </div>
              <div className="mt-5 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400 rounded-l-xl" />
                <h5 className="text-[12px] font-bold text-indigo-800 mb-1">เหตุผลจาก AI</h5>
                <p className="text-[13px] text-indigo-900/70 leading-relaxed">{rec.reasoning}</p>
              </div>
            </div>
          ))}
          {data.recommendations.length === 0 && (
            <div className="p-8 text-center text-stone-500 text-sm font-medium">
              ไม่มีคำแนะนำในการแก้ไขประโยคเพิ่มเติม
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SparkleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 3c.4 4.2 2.8 6.6 7 7-4.2.4-6.6 2.8-7 7-.4-4.2-2.8-6.6-7-7 4.2-.4 6.6-2.8 7-7Z" strokeLinejoin="round" />
      <path d="M19 16.5c.15 1.45 1.05 2.35 2.5 2.5-1.45.15-2.35 1.05-2.5 2.5-.15-1.45-1.05-2.35-2.5-2.5 1.45-.15 2.35-1.05 2.5-2.5Z" strokeLinejoin="round" />
    </svg>
  );
}
