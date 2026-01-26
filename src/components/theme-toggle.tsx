import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Sun03Icon, Moon02Icon } from '@hugeicons/core-free-icons'

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      <HugeiconsIcon icon={dark ? Sun03Icon : Moon02Icon} strokeWidth={2} />
    </Button>
  )
}
