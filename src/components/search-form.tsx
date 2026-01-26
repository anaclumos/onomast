import {
  ArrowMoveDownLeftIcon,
  CommandIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

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
    [submitForm]
  )

  return (
    <>
      <Button
        aria-label="Search"
        onClick={() => setOpen(true)}
        size="icon"
        variant="ghost"
      >
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
      </Button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent
          className="gap-0 overflow-hidden p-0 sm:max-w-md"
          showCloseButton={false}
        >
          <form onKeyDown={handleFormKeyDown} onSubmit={handleSubmit}>
            <DialogHeader className="sr-only">
              <DialogTitle>Search</DialogTitle>
              <DialogDescription>
                Check name availability across the internet
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 px-4 py-3">
              <HugeiconsIcon
                className="size-4 shrink-0 text-muted-foreground"
                icon={Search01Icon}
                strokeWidth={2}
              />
              <Input
                autoFocus
                className="border-0 bg-transparent px-0 font-medium text-sm shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
                onChange={(e) => setName(e.target.value)}
                placeholder="Company name"
                value={name}
              />
            </div>

            {showDescription && (
              <>
                <Separator />

                <div className="px-4 py-3">
                  <Textarea
                    className="min-h-0 resize-none border-0 bg-transparent px-0 text-xs shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does your company do? (optional — helps the AI vibe check)"
                    rows={2}
                    value={description}
                  />
                </div>
              </>
            )}

            <Separator />

            <div className="flex items-center justify-between px-4 py-2.5">
              <p className="text-muted-foreground text-xs">
                Checks domains, socials, packages &amp; more
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" type="submit">
                  Check
                  <kbd className="hidden items-center gap-0.5 rounded-md border bg-muted px-1 py-0.5 font-mono text-muted-foreground text-xs sm:flex">
                    <HugeiconsIcon
                      className="size-2"
                      icon={CommandIcon}
                      strokeWidth={2}
                    />
                    <HugeiconsIcon
                      className="size-2"
                      icon={ArrowMoveDownLeftIcon}
                      strokeWidth={2}
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
