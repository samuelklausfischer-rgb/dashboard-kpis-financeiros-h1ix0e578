import { dashboardKpis } from '@/data/mock'
import { KpiCard } from '@/components/KpiCard'

export default function Index() {
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
        {dashboardKpis.map((kpi, index) => (
          <KpiCard key={kpi.id} data={kpi} delay={index * 100} />
        ))}
      </div>
    </div>
  )
}
