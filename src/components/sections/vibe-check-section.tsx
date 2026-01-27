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
import { useTranslation } from '@/i18n/context'
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

interface VibeWidgetProps {
  vibeCheck: UseQueryResult<VibeCheckResult>
}

export function VibeGaugeWidget({ vibeCheck }: VibeWidgetProps) {
  const { t } = useTranslation()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-4"
            icon={SparklesIcon}
            strokeWidth={2}
          />
          {t('sections.vibeScore')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2">
        <VibeGaugeContent vibeCheck={vibeCheck} />
      </CardContent>
    </Card>
  )
}

export function VibeProConsWidget({ vibeCheck }: VibeWidgetProps) {
  const { t } = useTranslation()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-4"
            icon={ThumbsUpIcon}
            strokeWidth={2}
          />
          {t('sections.prosCons')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <VibeProConsContent vibeCheck={vibeCheck} />
      </CardContent>
    </Card>
  )
}

function VibeGaugeContent({ vibeCheck }: VibeWidgetProps) {
  const { t } = useTranslation()

  if (vibeCheck.isLoading) {
    return <SectionSkeleton rows={3} />
  }

  if (!vibeCheck.data) {
    return (
      <p className="text-muted-foreground text-xs">{t('vibe.unavailable')}</p>
    )
  }

  return (
    <>
      <GaugeContent data={vibeCheck.data} />
      <p className="text-center text-muted-foreground text-xs leading-relaxed">
        {vibeCheck.data.reason}
      </p>
    </>
  )
}

function VibeProConsContent({ vibeCheck }: VibeWidgetProps) {
  const { t } = useTranslation()

  if (vibeCheck.isLoading) {
    return <SectionSkeleton rows={4} />
  }

  if (!vibeCheck.data) {
    return (
      <p className="text-muted-foreground text-xs">
        {t('vibe.proConsUnavailable')}
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-success text-xs">
          {t('vibe.theGood')}
        </span>
        <p className="text-xs leading-relaxed">{vibeCheck.data.whyGood}</p>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-destructive text-xs">
          {t('vibe.theBad')}
        </span>
        <p className="text-xs leading-relaxed">{vibeCheck.data.whyBad}</p>
      </div>
    </>
  )
}

function GaugeContent({ data }: { data: VibeCheckResult }) {
  const { t } = useTranslation()
  const color = vibeColor(data.positivity)

  const score = data.positivity
  let label = t('vibe.deadOnArrival')
  if (score >= 80) {
    label = t('vibe.chefsKiss')
  } else if (score >= 60) {
    label = t('vibe.solidPick')
  } else if (score >= 40) {
    label = t('vibe.meh')
  } else if (score >= 20) {
    label = t('vibe.yikes')
  }

  const chartConfig = {
    score: { label: t('vibe.positivity') },
  } satisfies ChartConfig

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
