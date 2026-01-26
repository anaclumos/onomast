import { BalanceScaleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function ExternalLinksSection({ name }: { name: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-4"
            icon={BalanceScaleIcon}
            strokeWidth={2}
          />
          Trademark &amp; Business
        </CardTitle>
        <CardDescription>Manual lookups on external databases</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <a
          className="flex flex-col gap-0.5 rounded-md border p-2 transition-colors hover:bg-muted/50"
          href={`https://tmsearch.uspto.gov/search/search-results?query=${encodeURIComponent(name)}&section=default`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="font-medium text-xs">USPTO Trademark Search</span>
          <span className="text-muted-foreground text-xs">
            Search for &ldquo;{name}&rdquo; in the US trademark database
          </span>
        </a>
        <a
          className="flex flex-col gap-0.5 rounded-md border p-2 transition-colors hover:bg-muted/50"
          href={`https://opencorporates.com/companies?q=${encodeURIComponent(name)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="font-medium text-xs">OpenCorporates</span>
          <span className="text-muted-foreground text-xs">
            Search for &ldquo;{name}&rdquo; across company registries worldwide
          </span>
        </a>
      </CardContent>
    </Card>
  )
}
