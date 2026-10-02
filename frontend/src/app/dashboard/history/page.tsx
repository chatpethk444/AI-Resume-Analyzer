import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../login/actions'
import { Button } from '@/components/ui/button'

export default async function HistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch history (assuming analyses table exists)
  const { data: analyses, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Analysis History</h1>
          <form action={logout}>
            <Button variant="outline" className="border-slate-700 text-slate-950 hover:bg-slate-800 hover:text-slate-50">
              Sign Out
            </Button>
          </form>
        </div>

        <div className="grid gap-4">
          {analyses && analyses.length > 0 ? (
            analyses.map((analysis) => (
              <div key={analysis.id} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-indigo-400">Match Score: {analysis.match_score}%</h3>
                    <p className="text-sm text-slate-400">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                    <a href={`/dashboard/history/${analysis.id}`}>View Full Report</a>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
              <p>No analysis history found.</p>
              <Button asChild variant="link" className="text-indigo-400 mt-2">
                <a href="/">Run a new analysis</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
