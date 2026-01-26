'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export function WidgetCard({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
        onClick={() => setOpen(true)}
        type="button"
      >
        <div className="pointer-events-none h-full overflow-hidden rounded-lg [&>*]:h-full">
          {children}
        </div>
      </button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-h-svh gap-0 overflow-y-auto p-0 sm:max-w-xl">
          <DialogTitle className="sr-only">Details</DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    </>
  )
}
