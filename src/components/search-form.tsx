import {
  ArrowMoveDownLeftIcon,
  CommandIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from '@/i18n/context'
import { hasNonLatinCharacters } from '@/lib/utils'

const REGIONS = [
  'Global',
  'North America',
  'Europe',
  'East Asia',
  'Southeast Asia',
  'South Asia',
  'Latin America',
  'Middle East',
  'Africa',
  'Oceania',
] as const

const LANGUAGES = [
  'English',
  'Spanish',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'French',
  'German',
  'Portuguese',
  'Hindi',
  'Russian',
  'Italian',
  'Dutch',
  'Turkish',
  'Thai',
  'Vietnamese',
  'Indonesian',
] as const

export function SearchForm({
  defaultName = '',
  defaultDescription = '',
  defaultRegion = '',
  defaultLanguage = '',
  defaultLatinName = '',
  showDescription = true,
  onSearch,
}: {
  defaultName?: string
  defaultDescription?: string
  defaultRegion?: string
  defaultLanguage?: string
  defaultLatinName?: string
  showDescription?: boolean
  onSearch: (
    name: string,
    description: string,
    region: string,
    language: string,
    latinName: string
  ) => void
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(defaultName)
  const [description, setDescription] = useState(defaultDescription)
  const [region, setRegion] = useState(defaultRegion)
  const [language, setLanguage] = useState(defaultLanguage)
  const [latinName, setLatinName] = useState(defaultLatinName)
  const isNonLatin = useMemo(() => hasNonLatinCharacters(name), [name])

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
      const trimmedLatin = latinName.trim().toLowerCase()
      onSearch(trimmed, description.trim(), region, language, trimmedLatin)
      setOpen(false)
    }
  }, [name, latinName, description, region, language, onSearch])

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
        aria-label={t('search.title')}
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
          <form onSubmit={handleSubmit}>
            <DialogHeader className="sr-only">
              <DialogTitle>{t('search.title')}</DialogTitle>
              <DialogDescription>{t('search.description')}</DialogDescription>
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
                onKeyDown={handleFormKeyDown}
                placeholder={t('search.namePlaceholder')}
                value={name}
              />
            </div>

            {isNonLatin && (
              <>
                <Separator />
                <div className="px-4 py-3">
                  <p className="mb-1.5 text-muted-foreground text-xs">
                    {t('search.latinNameHint')}
                  </p>
                  <Input
                    className="border-0 bg-transparent px-0 font-medium text-sm shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
                    onChange={(e) => setLatinName(e.target.value)}
                    onKeyDown={handleFormKeyDown}
                    placeholder={t('search.latinNamePlaceholder')}
                    value={latinName}
                  />
                </div>
              </>
            )}

            {showDescription && (
              <>
                <Separator />

                <div className="px-4 py-3">
                  <Textarea
                    className="min-h-0 resize-none border-0 bg-transparent px-0 text-xs shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={handleFormKeyDown}
                    placeholder={t('search.descriptionPlaceholder')}
                    rows={2}
                    value={description}
                  />
                </div>

                <Separator />

                <div className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground text-xs">
                      Region
                    </span>
                    <Select
                      onValueChange={(v) => setRegion(v ?? '')}
                      value={region || undefined}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="Global" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground text-xs">
                      Language
                    </span>
                    <Select
                      onValueChange={(v) => setLanguage(v ?? '')}
                      value={language || undefined}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="English" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex items-center justify-between px-4 py-2.5">
              <p className="text-muted-foreground text-xs">
                {t('search.hint')}
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" type="submit">
                  {t('search.submit')}
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
