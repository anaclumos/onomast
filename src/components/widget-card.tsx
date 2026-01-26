'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export function WidgetCard({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className="h-full cursor-pointer"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="pointer-events-none h-full overflow-hidden rounded-lg [&>*]:h-full">
          {children}
        </div>
      </div>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-h-svh gap-0 overflow-y-auto p-0 sm:max-w-xl">
          <DialogTitle className="sr-only">Details</DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    </>
  )
}
