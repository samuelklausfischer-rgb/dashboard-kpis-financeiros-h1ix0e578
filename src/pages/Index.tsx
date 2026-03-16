import { useEffect, useState } from 'react'
import { KpiCard } from '@/components/KpiCard'
import { useDateRange } from '@/contexts/DateRangeContext'
import { fetchDashboardData } from '@/services/kpis'
import { KpiData } from '@/types/dashboard'
import { Skeleton } from '@/components/ui/skeleton'

export default function Index() {
  const { dateRange } = useDateRange()
  const [data, setData] = useState<KpiData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!dateRange?.from || !dateRange?.to) return
      setLoading(true)
      const kpis = await fetchDashboardData(dateRange.from, dateRange.to)
      setData(kpis)
      setLoading(false)
    }
    loadData()
  }, [dateRange])

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral</h2>
          <p className="text-slate-500 mt-1 text-sm">
            Acompanhe o desempenho financeiro em tempo real com base no período selecionado.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
            ))
          : data.map((kpi, index) => <KpiCard key={kpi.id} data={kpi} delay={index * 100} />)}
      </div>
    </div>
  )
}
