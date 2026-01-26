'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export function WidgetCard({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        className="cursor-pointer"
      >
        <div className="pointer-events-none overflow-hidden rounded-lg">
          {children}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-svh gap-0 overflow-y-auto p-0 sm:max-w-xl">
          <DialogTitle className="sr-only">Details</DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    </>
  )
}
