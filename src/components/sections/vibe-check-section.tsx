'use client'

import type { UseQueryResult } from '@tanstack/react-query'
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { SectionSkeleton } from '@/components/section-skeleton'
import type { VibeCheckResult } from '@/lib/types'

function vibeColor(score: number): string {
  if (score >= 67) return 'var(--color-success)'
  if (score >= 34) return 'var(--color-warning)'
  return 'var(--color-destructive)'
}

function vibeLabel(score: number): string {
  if (score >= 80) return "Chef's Kiss"
  if (score >= 60) return 'Solid Pick'
  if (score >= 40) return 'Meh'
  if (score >= 20) return 'Yikes'
  return 'Dead on Arrival'
}

const chartConfig = {
  score: { label: 'Positivity' },
  empty: { label: 'Remaining' },
} satisfies ChartConfig

type VibeWidgetProps = {
  vibeCheck: UseQueryResult<VibeCheckResult>
}

export function VibeGaugeWidget({ vibeCheck }: VibeWidgetProps) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col items-center pt-3">
        {vibeCheck.isLoading ? (
          <SectionSkeleton rows={3} />
        ) : vibeCheck.data ? (
          <GaugeContent data={vibeCheck.data} />
        ) : (
          <p className="text-xs text-muted-foreground">
            AI vibe check unavailable.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function VibeGoodWidget({ vibeCheck }: VibeWidgetProps) {
  return (
    <Card size="sm" className="border-success/30 bg-success/5">
      <CardContent className="flex flex-col gap-1.5 pt-3">
        {vibeCheck.isLoading ? (
          <SectionSkeleton rows={2} />
        ) : vibeCheck.data ? (
          <>
            <span className="text-xs font-semibold text-success">The Good</span>
            <p className="text-xs leading-relaxed">{vibeCheck.data.whyGood}</p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Unavailable.</p>
        )}
      </CardContent>
    </Card>
  )
}

export function VibeBadWidget({ vibeCheck }: VibeWidgetProps) {
  return (
    <Card size="sm" className="border-destructive/30 bg-destructive/5">
      <CardContent className="flex flex-col gap-1.5 pt-3">
        {vibeCheck.isLoading ? (
          <SectionSkeleton rows={2} />
        ) : vibeCheck.data ? (
          <>
            <span className="text-xs font-semibold text-destructive">
              The Bad
            </span>
            <p className="text-xs leading-relaxed">{vibeCheck.data.whyBad}</p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Unavailable.</p>
        )}
      </CardContent>
    </Card>
  )
}

function GaugeContent({ data }: { data: VibeCheckResult }) {
  const color = vibeColor(data.positivity)
  const label = vibeLabel(data.positivity)

  const chartData = [
    {
      score: data.positivity,
      empty: 100 - data.positivity,
    },
  ]

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto w-full aspect-square -mb-20"
    >
      <RadialBarChart
        data={chartData}
        endAngle={180}
        innerRadius={50}
        outerRadius={80}
        cy="55%"
        startAngle={0}
      >
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {data.positivity}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground text-xs"
                    >
                      {label}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="score"
          stackId="a"
          cornerRadius={5}
          fill={color}
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="empty"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-muted)"
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  )
}
