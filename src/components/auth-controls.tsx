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
  const [showSignIn, setShowSignIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await authClient.signIn.email({ email, password })
      setShowSignIn(false)
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (isPending) {
    return null
  }

  if (!session) {
    return (
      <Dialog onOpenChange={setShowSignIn} open={showSignIn}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Log in
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>
              Enter your email and password to sign in
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSignIn}>
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
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
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
