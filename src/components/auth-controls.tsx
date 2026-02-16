'use client'

import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

export function AuthControls() {
  const { data: session, isPending } = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setError('')
  }

  const isSignUp = mode === 'signup'
  const submitLabel = isSignUp ? 'Create account' : 'Sign in'
  const loadingLabel = isSignUp ? 'Creating account...' : 'Signing in...'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        await authClient.signUp.email({ email, password, name })
      } else {
        await authClient.signIn.email({ email, password })
      }
      setShowDialog(false)
      resetForm()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `${mode === 'signup' ? 'Sign up' : 'Sign in'} failed`
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isPending) {
    return null
  }

  if (!session) {
    return (
      <Dialog
        onOpenChange={(open) => {
          setShowDialog(open)
          if (!open) {
            resetForm()
            setMode('signin')
          }
        }}
        open={showDialog}
      >
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Log in
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === 'signup' ? 'Create account' : 'Sign in'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'signup'
                ? 'Enter your details to create an account'
                : 'Enter your email and password to sign in'}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="font-medium text-xs" htmlFor="name">
                  Name
                </label>
                <Input
                  disabled={isLoading}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  type="text"
                  value={name}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="font-medium text-xs" htmlFor="email">
                Email
              </label>
              <Input
                disabled={isLoading}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-xs" htmlFor="password">
                Password
              </label>
              <Input
                disabled={isLoading}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
            </div>
            {error && <p className="text-destructive text-xs">{error}</p>}
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? loadingLabel : submitLabel}
            </Button>
            <p className="text-center text-muted-foreground text-xs">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    className="text-foreground underline"
                    onClick={() => {
                      resetForm()
                      setMode('signin')
                    }}
                    type="button"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    className="text-foreground underline"
                    onClick={() => {
                      resetForm()
                      setMode('signup')
                    }}
                    type="button"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs">
        {session.user.name || session.user.email}
      </span>
      <Button
        disabled={isSigningOut}
        onClick={async () => {
          setIsSigningOut(true)
          try {
            await authClient.signOut()
            window.location.href = '/'
          } finally {
            setIsSigningOut(false)
          }
        }}
        size="sm"
        variant="outline"
      >
        {isSigningOut ? 'Signing out...' : 'Sign out'}
      </Button>
    </div>
  )
}
