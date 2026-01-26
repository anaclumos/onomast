'use client'

import type { UseQueryResult } from '@tanstack/react-query'
import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { SectionSkeleton } from '@/components/section-skeleton'
import type { VibeCheckResult } from '@/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import { SparklesIcon, ThumbsUpIcon } from '@hugeicons/core-free-icons'

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
} satisfies ChartConfig

type VibeWidgetProps = {
  vibeCheck: UseQueryResult<VibeCheckResult>
}

export function VibeGaugeWidget({ vibeCheck }: VibeWidgetProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={SparklesIcon}
            strokeWidth={2}
            className="size-4"
          />
          Vibe Score
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2">
        {vibeCheck.isLoading ? (
          <SectionSkeleton rows={3} />
        ) : vibeCheck.data ? (
          <>
            <GaugeContent data={vibeCheck.data} />
            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              {vibeCheck.data.reason}
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            AI vibe check unavailable.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function VibeProConsWidget({ vibeCheck }: VibeWidgetProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={ThumbsUpIcon}
            strokeWidth={2}
            className="size-4"
          />
          Pros &amp; Cons
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {vibeCheck.isLoading ? (
          <SectionSkeleton rows={4} />
        ) : vibeCheck.data ? (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-success">
                The Good
              </span>
              <p className="text-xs leading-relaxed">
                {vibeCheck.data.whyGood}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-destructive">
                The Bad
              </span>
              <p className="text-xs leading-relaxed">{vibeCheck.data.whyBad}</p>
            </div>
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

  const chartData = [{ score: data.positivity }]

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto w-full aspect-square -mb-20"
    >
      <RadialBarChart
        data={chartData}
        startAngle={180}
        endAngle={0}
        innerRadius={50}
        outerRadius={80}
        cy="55%"
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
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
          cornerRadius={5}
          fill={color}
          background={{ fill: 'var(--color-muted)' }}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  )
}
