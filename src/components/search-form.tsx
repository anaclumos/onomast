import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon } from '@hugeicons/core-free-icons'

export function SearchForm({
  defaultName = '',
  defaultDescription = '',
  onSearch,
}: {
  defaultName?: string
  defaultDescription?: string
  onSearch: (name: string, description: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(defaultName)
  const [description, setDescription] = useState(defaultDescription)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setOpen((prev) => !prev)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim().toLowerCase()
    if (trimmed) {
      onSearch(trimmed, description.trim())
      setOpen(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-1 items-center gap-2 rounded-md border border-input bg-input/20 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-input/40 dark:bg-input/30"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="size-3.5 shrink-0"
        />
        <span className="truncate">{defaultName || 'Search a name...'}</span>
        <kbd className="ml-auto hidden shrink-0 rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:inline-block">
          &thinsp;K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md gap-0 p-0 overflow-hidden"
        >
          <form onSubmit={handleSubmit}>
            <DialogHeader className="sr-only">
              <DialogTitle>Search</DialogTitle>
              <DialogDescription>
                Check name availability across the internet
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 px-3 py-2.5">
              <HugeiconsIcon
                icon={Search01Icon}
                strokeWidth={2}
                className="size-4 shrink-0 text-muted-foreground"
              />
              <Input
                placeholder="Company name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-0 bg-transparent p-0 text-sm font-medium shadow-none ring-0 focus-visible:ring-0 focus-visible:border-0"
                autoFocus
              />
            </div>

            <Separator />

            <div className="px-3 py-2.5">
              <Textarea
                placeholder="What does your company do? (optional — helps the AI vibe check)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="border-0 bg-transparent p-0 text-xs shadow-none ring-0 min-h-0 focus-visible:ring-0 focus-visible:border-0 resize-none"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-xs text-muted-foreground">
                Checks domains, socials, packages &amp; more
              </p>
              <Button type="submit" size="sm">
                <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
                Check
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
