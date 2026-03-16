import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowDownRight, ArrowUpRight, Info } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { KpiData } from '@/data/mock'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  data: KpiData
  delay?: number
}

const formatValue = (value: number, format: 'currency' | 'percent' | 'number') => {
  if (format === 'currency') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  if (format === 'percent') {
    return `${value.toFixed(1)}%`
  }
  return value.toLocaleString('pt-BR')
}

export function KpiCard({ data, delay = 0 }: KpiCardProps) {
  const { title, description, value, format, variation, invertedLogic, data: chartData } = data

  const isPositiveVariation = variation > 0
  const isGood = invertedLogic ? !isPositiveVariation : isPositiveVariation

  const trendColor = isGood ? 'text-emerald-500' : 'text-rose-500'
  const TrendIcon = isPositiveVariation ? ArrowUpRight : ArrowDownRight

  const chartConfig = {
    value: {
      label: title,
      color: 'hsl(var(--primary))',
    },
  }

  // Create a subtle unique ID for the gradient based on the card title
  const gradientId = useMemo(() => `gradient-${title.replace(/\s+/g, '-').toLowerCase()}`, [title])

  return (
    <Card
      className={cn(
        'overflow-hidden flex flex-col justify-between border-slate-200 bg-white transition-all duration-300 hover:shadow-elevation hover:-translate-y-1 animate-fade-in-up',
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5 space-y-0">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </CardTitle>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
              <Info className="h-4 w-4" />
              <span className="sr-only">Info sobre {title}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px] text-center">
            <p className="text-sm">{description}</p>
          </TooltipContent>
        </Tooltip>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {formatValue(value, format)}
          </div>
          <div className="flex items-center mt-2 text-sm font-medium">
            <span
              className={cn(
                'flex items-center bg-opacity-10 px-1.5 py-0.5 rounded-md',
                isGood ? 'bg-emerald-100' : 'bg-rose-100',
                trendColor,
              )}
            >
              <TrendIcon className="h-3.5 w-3.5 mr-1" strokeWidth={2.5} />
              {Math.abs(variation).toFixed(1)}%
            </span>
            <span className="text-slate-500 ml-2 font-normal">vs. mês anterior</span>
          </div>
        </div>

        <div className="h-[60px] w-full mt-6 -mx-2 -mb-2">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      className="text-blue-600"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      className="text-blue-600"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis domain={['dataMin - (dataMin * 0.05)', 'dataMax + (dataMax * 0.05)']} hide />
                <RechartsTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value) => (
                        <div className="flex items-center text-xs font-semibold">
                          <span className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
                          {formatValue(value as number, format)}
                        </div>
                      )}
                      className="min-w-[120px]"
                    />
                  }
                  cursor={{
                    stroke: 'currentColor',
                    strokeWidth: 1,
                    strokeDasharray: '3 3',
                    className: 'text-slate-300',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="currentColor"
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  className="text-blue-600"
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
