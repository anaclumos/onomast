'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export function AuthControls() {
  const { data: session, isPending } = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (isPending) {
    return null
  }

  if (!session) {
    return (
      <Button
        onClick={() => {
          window.location.href = '/auth/signin'
        }}
        size="sm"
        variant="outline"
      >
        Log in
      </Button>
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
