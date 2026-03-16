import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { KpiCard } from '@/components/KpiCard'
import { KpiData } from '@/types/dashboard'
import { fetchUnidadeDetails } from '@/services/unidades'

export default function UnidadeDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [unitName, setUnitName] = useState('')
  const [kpis, setKpis] = useState<KpiData[]>([])
  const [hasData, setHasData] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      if (!id) return
      setLoading(true)
      const { unidadeName, kpis, hasData } = await fetchUnidadeDetails(id, new Date())
      if (mounted) {
        setUnitName(unidadeName)
        setKpis(kpis)
        setHasData(hasData)
        setLoading(false)
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [id])

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-900 border-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            {loading ? <Skeleton className="h-8 w-48" /> : unitName}
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Visão detalhada de performance e histórico de 30 dias.
          </p>
        </div>
      </div>

      {!loading && !hasData ? (
        <Alert className="mt-4 bg-amber-50 border-amber-200 text-amber-800 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-semibold">Dados não disponíveis</AlertTitle>
          <AlertDescription className="text-amber-700 mt-1">
            Sem dados registrados para esta unidade no período de 30 dias.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
              ))
            : kpis.map((kpi, index) => <KpiCard key={kpi.id} data={kpi} delay={index * 100} />)}
        </div>
      )}
    </div>
  )
}
