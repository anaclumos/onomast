import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { HugeiconsIcon } from '@hugeicons/react'
import { BalanceScaleIcon } from '@hugeicons/core-free-icons'

export function ExternalLinksSection({ name }: { name: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={BalanceScaleIcon}
            strokeWidth={2}
            className="size-4"
          />
          Trademark &amp; Business
        </CardTitle>
        <CardDescription>Manual lookups on external databases</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <a
          href={`https://tmsearch.uspto.gov/search/search-results?query=${encodeURIComponent(name)}&section=default`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-0.5 rounded-md border p-2 transition-colors hover:bg-muted/50"
        >
          <span className="text-xs font-medium">USPTO Trademark Search</span>
          <span className="text-xs text-muted-foreground">
            Search for &ldquo;{name}&rdquo; in the US trademark database
          </span>
        </a>
        <a
          href={`https://opencorporates.com/companies?q=${encodeURIComponent(name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-0.5 rounded-md border p-2 transition-colors hover:bg-muted/50"
        >
          <span className="text-xs font-medium">OpenCorporates</span>
          <span className="text-xs text-muted-foreground">
            Search for &ldquo;{name}&rdquo; across company registries worldwide
          </span>
        </a>
      </CardContent>
    </Card>
  )
}
