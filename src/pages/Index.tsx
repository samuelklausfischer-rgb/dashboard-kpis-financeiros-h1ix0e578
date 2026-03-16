import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { KpiCard } from '@/components/KpiCard'
import { fetchDashboardData } from '@/services/kpis'
import { KpiData } from '@/types/dashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Index() {
  const [data, setData] = useState<KpiData[]>([])
  const [hasData, setHasData] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      // Using new Date() to fetch "Current Day" data per requirements
      const { kpis, hasTodayData } = await fetchDashboardData(new Date())
      setData(kpis)
      setHasData(hasTodayData)
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral</h2>
          <p className="text-slate-500 mt-1 text-sm">
            Acompanhe o desempenho financeiro em tempo real comparado ao dia anterior.
          </p>
        </div>
      </div>

      {!loading && !hasData ? (
        <Alert className="mt-4 bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-semibold">Nenhum dado encontrado</AlertTitle>
          <AlertDescription className="text-amber-700 mt-1">
            Nenhum dado encontrado para o dia de hoje. Por favor, verifique se os dados foram
            importados corretamente.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
              ))
            : data.map((kpi, index) => <KpiCard key={kpi.id} data={kpi} delay={index * 100} />)}
        </div>
      )}
    </div>
  )
}
