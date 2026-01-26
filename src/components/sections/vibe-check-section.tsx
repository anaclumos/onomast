'use client'

import { SparklesIcon, ThumbsUpIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'
import { SectionSkeleton } from '@/components/section-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChartConfig } from '@/components/ui/chart'
import { ChartContainer } from '@/components/ui/chart'
import type { VibeCheckResult } from '@/lib/types'

function vibeColor(score: number): string {
  if (score >= 67) {
    return 'var(--color-success)'
  }
  if (score >= 34) {
    return 'var(--color-warning)'
  }
  return 'var(--color-destructive)'
}

function vibeLabel(score: number): string {
  if (score >= 80) {
    return "Chef's Kiss"
  }
  if (score >= 60) {
    return 'Solid Pick'
  }
  if (score >= 40) {
    return 'Meh'
  }
  if (score >= 20) {
    return 'Yikes'
  }
  return 'Dead on Arrival'
}

const chartConfig = {
  score: { label: 'Positivity' },
} satisfies ChartConfig

interface VibeWidgetProps {
  vibeCheck: UseQueryResult<VibeCheckResult>
}

export function VibeGaugeWidget({ vibeCheck }: VibeWidgetProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-4"
            icon={SparklesIcon}
            strokeWidth={2}
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
            <p className="text-center text-muted-foreground text-xs leading-relaxed">
              {vibeCheck.data.reason}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground text-xs">
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
            className="size-4"
            icon={ThumbsUpIcon}
            strokeWidth={2}
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
              <span className="font-semibold text-success text-xs">
                The Good
              </span>
              <p className="text-xs leading-relaxed">
                {vibeCheck.data.whyGood}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-destructive text-xs">
                The Bad
              </span>
              <p className="text-xs leading-relaxed">{vibeCheck.data.whyBad}</p>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-xs">Unavailable.</p>
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
      className="mx-auto -mb-20 aspect-square w-full"
      config={chartConfig}
    >
      <RadialBarChart
        cy="55%"
        data={chartData}
        endAngle={0}
        innerRadius={50}
        outerRadius={80}
        startAngle={180}
      >
        <PolarAngleAxis
          axisLine={false}
          domain={[0, 100]}
          tick={false}
          type="number"
        />
        <PolarRadiusAxis axisLine={false} tick={false} tickLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                    <tspan
                      className="fill-foreground font-bold text-3xl"
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                    >
                      {data.positivity}
                    </tspan>
                    <tspan
                      className="fill-muted-foreground text-xs"
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
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
          background={{ fill: 'var(--color-muted)' }}
          className="stroke-2 stroke-transparent"
          cornerRadius={5}
          dataKey="score"
          fill={color}
        />
      </RadialBarChart>
    </ChartContainer>
  )
}
