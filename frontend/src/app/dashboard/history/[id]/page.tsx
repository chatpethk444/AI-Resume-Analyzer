import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ResultsDashboard from '@/components/ResultsDashboard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AnalysisDetail({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: analysis, error } = await supabase
    .from('analyses')
    .select('*, resumes(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !analysis) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center">
        <p className="text-red-400">Analysis not found.</p>
        <Button asChild variant="link" className="text-indigo-400 mt-4">
          <Link href="/dashboard/history">Return to History</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
            <Link href="/dashboard/history">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Report Details
            </h1>
            <p className="text-sm text-slate-400">
              Analyzed on {new Date(analysis.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <ResultsDashboard data={analysis.ai_feedback} />
      </div>
    </main>
  )
}
