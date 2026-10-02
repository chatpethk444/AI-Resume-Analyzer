import { login, signup } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md bg-slate-900/80 border-slate-800 backdrop-blur-md shadow-xl z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-200">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to save your resume analysis history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-slate-950 border-slate-700 text-slate-300"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-slate-950 border-slate-700 text-slate-300"
              />
            </div>

            {searchParams?.error && (
              <div className="text-sm text-red-400 p-2 bg-red-400/10 rounded">
                {searchParams.error}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <Button formAction={login} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Sign In
              </Button>
              <Button formAction={signup} variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
