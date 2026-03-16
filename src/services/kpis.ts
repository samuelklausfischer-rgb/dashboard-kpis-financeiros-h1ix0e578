import { supabase } from '@/lib/supabase/client'
import { KpiData, DataPoint } from '@/types/dashboard'
import { format, subDays } from 'date-fns'

export async function fetchDashboardData(
  targetDate: Date = new Date(),
): Promise<{ kpis: KpiData[]; hasTodayData: boolean }> {
  const targetDateStr = format(targetDate, 'yyyy-MM-dd')
  const prevDateStr = format(subDays(targetDate, 1), 'yyyy-MM-dd')
  const startDateStr = format(subDays(targetDate, 30), 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('kpis_diarios')
    .select('*')
    .gte('data', startDateStr)
    .lte('data', targetDateStr)
    .order('data', { ascending: true })

  if (error) {
    console.error('Error fetching KPIs:', error)
    return { kpis: [], hasTodayData: false }
  }

  const records = data || []

  // Check if we have records for today
  const todayRecords = records.filter((r) => r.data === targetDateStr)
  const hasTodayData = todayRecords.length > 0

  // Group by date for the charts (Macro view - sum across all units)
  const groupedByDate: Record<string, any> = {}
  records.forEach((r) => {
    if (!groupedByDate[r.data]) {
      groupedByDate[r.data] = {
        faturamento_bruto: 0,
        custos_totais: 0,
        despesas_totais: 0,
        margem_contribuicao: 0,
        resultado_financeiro: 0,
        ebitda: 0,
      }
    }
    groupedByDate[r.data].faturamento_bruto += Number(r.faturamento_bruto || 0)
    groupedByDate[r.data].custos_totais += Number(r.custos_totais || 0)
    groupedByDate[r.data].despesas_totais += Number(r.despesas_totais || 0)
    groupedByDate[r.data].margem_contribuicao += Number(r.margem_contribuicao || 0)
    groupedByDate[r.data].resultado_financeiro += Number(r.resultado_financeiro || 0)
    groupedByDate[r.data].ebitda += Number(r.ebitda || 0)
  })

  const todayAgg = groupedByDate[targetDateStr] || {
    faturamento_bruto: 0,
    custos_totais: 0,
    despesas_totais: 0,
    margem_contribuicao: 0,
    resultado_financeiro: 0,
    ebitda: 0,
  }

  const prevAgg = groupedByDate[prevDateStr] || {
    faturamento_bruto: 0,
    custos_totais: 0,
    despesas_totais: 0,
    margem_contribuicao: 0,
    resultado_financeiro: 0,
    ebitda: 0,
  }

  const buildDaily = (key: string): DataPoint[] => {
    const result: DataPoint[] = []
    for (let i = 30; i >= 0; i--) {
      const d = format(subDays(targetDate, i), 'yyyy-MM-dd')
      result.push({
        date: d,
        value: groupedByDate[d]?.[key] || 0,
      })
    }
    return result
  }

  const calcVar = (curr: number, prev: number): number | null => {
    if (!prev || prev === 0) return null
    return ((curr - prev) / Math.abs(prev)) * 100
  }

  const kpis: KpiData[] = [
    {
      id: 'faturamento',
      title: 'Faturamento Bruto',
      description: 'Receita total antes de deduções, impostos ou custos.',
      value: todayAgg.faturamento_bruto,
      format: 'currency',
      variation: calcVar(todayAgg.faturamento_bruto, prevAgg.faturamento_bruto),
      data: buildDaily('faturamento_bruto'),
    },
    {
      id: 'custos',
      title: 'Custos Totais',
      description: 'Custos variáveis diretos atrelados à produção ou prestação de serviços.',
      value: todayAgg.custos_totais,
      format: 'currency',
      variation: calcVar(todayAgg.custos_totais, prevAgg.custos_totais),
      invertedLogic: true,
      data: buildDaily('custos_totais'),
    },
    {
      id: 'despesas',
      title: 'Despesas Totais',
      description: 'Despesas operacionais fixas (administrativas, vendas, etc).',
      value: todayAgg.despesas_totais,
      format: 'currency',
      variation: calcVar(todayAgg.despesas_totais, prevAgg.despesas_totais),
      invertedLogic: true,
      data: buildDaily('despesas_totais'),
    },
    {
      id: 'margem',
      title: 'Margem de Contribuição',
      description: 'Lucro bruto menos custos variáveis. Essencial para cobrir despesas fixas.',
      value: todayAgg.margem_contribuicao,
      format: 'currency',
      variation: calcVar(todayAgg.margem_contribuicao, prevAgg.margem_contribuicao),
      data: buildDaily('margem_contribuicao'),
    },
    {
      id: 'resultado',
      title: 'Resultado Financeiro',
      description: 'Saldo líquido de receitas e despesas financeiras (juros, rendimentos).',
      value: todayAgg.resultado_financeiro,
      format: 'currency',
      variation: calcVar(todayAgg.resultado_financeiro, prevAgg.resultado_financeiro),
      data: buildDaily('resultado_financeiro'),
    },
    {
      id: 'ebitda',
      title: 'EBITDA',
      description:
        'Lucro antes de juros, impostos, depreciação e amortização. Indica o potencial de geração de caixa.',
      value: todayAgg.ebitda,
      format: 'currency',
      variation: calcVar(todayAgg.ebitda, prevAgg.ebitda),
      data: buildDaily('ebitda'),
    },
  ]

  return { kpis, hasTodayData }
}
