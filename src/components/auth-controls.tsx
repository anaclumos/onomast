import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/tanstack-react-start'
import { Button } from '@/components/ui/button'

export function AuthControls() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button size="sm" variant="outline">
            Log in
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}
