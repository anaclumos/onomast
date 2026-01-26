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
import { Search01Icon, CommandIcon, ArrowMoveDownLeftIcon } from '@hugeicons/core-free-icons'

export function SearchForm({
  defaultName = '',
  defaultDescription = '',
  showDescription = true,
  onSearch,
}: {
  defaultName?: string
  defaultDescription?: string
  showDescription?: boolean
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

  const submitForm = useCallback(() => {
    const trimmed = name.trim().toLowerCase()
    if (trimmed) {
      onSearch(trimmed, description.trim())
      setOpen(false)
    }
  }, [name, description, onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitForm()
  }

  const handleFormKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        submitForm()
      }
    },
    [submitForm],
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md gap-0 p-0 overflow-hidden"
        >
          <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
            <DialogHeader className="sr-only">
              <DialogTitle>Search</DialogTitle>
              <DialogDescription>
                Check name availability across the internet
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 px-4 py-3">
              <HugeiconsIcon
                icon={Search01Icon}
                strokeWidth={2}
                className="size-4 shrink-0 text-muted-foreground"
              />
              <Input
                placeholder="Company name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-0 bg-transparent px-0 text-sm font-medium shadow-none ring-0 focus-visible:ring-0 focus-visible:border-0"
                autoFocus
              />
            </div>

            {showDescription && (
              <>
                <Separator />

                <div className="px-4 py-3">
                  <Textarea
                    placeholder="What does your company do? (optional — helps the AI vibe check)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="border-0 bg-transparent px-0 text-xs shadow-none ring-0 min-h-0 focus-visible:ring-0 focus-visible:border-0 resize-none"
                  />
                </div>
              </>
            )}

            <Separator />

            <div className="flex items-center justify-between px-4 py-2.5">
              <p className="text-xs text-muted-foreground">
                Checks domains, socials, packages &amp; more
              </p>
              <div className="flex items-center gap-2">
                <Button type="submit" size="sm">
                  Check
                <kbd className="hidden items-center gap-0.5 rounded-md border bg-muted px-1 py-0.5 font-mono text-xs text-muted-foreground sm:flex">
                  <HugeiconsIcon
                    icon={CommandIcon}
                    strokeWidth={2}
                    className="size-2"
                  />
                  <HugeiconsIcon
                    icon={ArrowMoveDownLeftIcon}
                    strokeWidth={2}
                    className="size-2"
                  />
                </kbd>
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
