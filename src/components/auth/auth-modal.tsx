import { useState } from 'react'
import { useAuth } from '../../context/auth-context'
import { formatAuthError } from '../../services/auth-service'
import { Dialog } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { RoleCategoryId } from '../../types'
import { BENCHMARK_ROLES } from '../../data/initial-data'
import { Sparkles, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    sendPasswordReset, 
    isConfigured, 
    missingKeys 
  } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [targetRoleId, setTargetRoleId] = useState<RoleCategoryId>('fullstack-intern')
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleModeSwitch = (newMode: 'signin' | 'signup' | 'forgot') => {
    setMode(newMode)
    setErrorMsg(null)
    setSuccessMsg(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!isConfigured) {
      setErrorMsg(`Firebase configuration is missing in .env (${missingKeys.join(', ')}). Please provide genuine Firebase Web credentials.`)
      return
    }

    setLoading(true)

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password)
        onClose()
      } else if (mode === 'signup') {
        if (!displayName.trim()) {
          setErrorMsg('Please enter your full name.')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.')
          setLoading(false)
          return
        }
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match.')
          setLoading(false)
          return
        }
        await signUpWithEmail(email, password, displayName, targetRoleId)
        onClose()
      } else if (mode === 'forgot') {
        await sendPasswordReset(email)
        setSuccessMsg('Password reset email sent! Check your inbox for instructions.')
      }
    } catch (err: any) {
      const code = err?.code || ''
      setErrorMsg(formatAuthError(code) || err?.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!isConfigured) {
      setErrorMsg(`Firebase configuration is missing in .env.`)
      return
    }

    setLoading(true)
    try {
      await signInWithGoogle()
      onClose()
    } catch (err: any) {
      const code = err?.code || ''
      setErrorMsg(formatAuthError(code) || err?.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-md p-6 sm:p-7">
      <div className="space-y-5">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            {mode === 'signin' && 'Welcome back to Growlytics'}
            {mode === 'signup' && 'Create your Student Account'}
            {mode === 'forgot' && 'Reset your Password'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {mode === 'signin' && 'Sign in to access your personal roadmaps and project proof'}
            {mode === 'signup' && 'Begin building your verifiable internship portfolio today'}
            {mode === 'forgot' && 'Enter your email to receive a password recovery link'}
          </p>
        </div>

        {/* Configuration Warning if .env missing */}
        {!isConfigured && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Firebase credentials required
            </p>
            <p className="text-[11px] leading-relaxed">
              Copy <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">.env.example</code> to <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">.env</code> and fill in your web app credentials for project <code className="font-semibold">growlytics-6b528</code>.
            </p>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        {mode !== 'forgot' && (
          <div>
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-muted font-semibold text-xs text-foreground transition-colors cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-2 text-[10px] uppercase font-bold text-muted-foreground">
                or with email
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="pl-9 text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="pl-9 text-xs"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-foreground">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('forgot')}
                    className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 text-xs"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Initial Target Internship Role
                </label>
                <select
                  value={targetRoleId}
                  onChange={(e) => setTargetRoleId(e.target.value as RoleCategoryId)}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {BENCHMARK_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            variant="sprout"
            className="w-full text-xs font-bold py-2.5 cursor-pointer shadow-xs"
          >
            {loading ? 'Processing...' : (
              mode === 'signin' ? 'Sign In' :
              mode === 'signup' ? 'Create Account' :
              'Send Reset Email'
            )}
          </Button>
        </form>

        {/* Footer mode toggle */}
        <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
          {mode === 'signin' && (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => handleModeSwitch('signup')}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => handleModeSwitch('signin')}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button
              onClick={() => handleModeSwitch('signin')}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </Dialog>
  )
}
