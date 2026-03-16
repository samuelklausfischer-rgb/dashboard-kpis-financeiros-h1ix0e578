import { supabase } from '@/lib/supabase/client'
import { KpiData, DataPoint } from '@/types/dashboard'

export async function fetchDashboardData(startDate: Date, endDate: Date): Promise<KpiData[]> {
  const durationInDays = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
  )

  const prevEndDate = new Date(startDate)
  prevEndDate.setDate(prevEndDate.getDate() - 1)

  const prevStartDate = new Date(prevEndDate)
  prevStartDate.setDate(prevStartDate.getDate() - durationInDays + 1)

  const [currentResponse, prevResponse] = await Promise.all([
    supabase
      .from('kpis_diarios' as any)
      .select('*')
      .gte('data', startDate.toISOString().split('T')[0])
      .lte('data', endDate.toISOString().split('T')[0])
      .order('data', { ascending: true }),
    supabase
      .from('kpis_diarios' as any)
      .select('*')
      .gte('data', prevStartDate.toISOString().split('T')[0])
      .lte('data', prevEndDate.toISOString().split('T')[0]),
  ])

  const currentData = currentResponse.data || []
  const prevData = prevResponse.data || []

  const aggregate = (data: any[], key: string) =>
    data.reduce((sum, row) => sum + Number(row[key] || 0), 0)

  const buildDaily = (data: any[], key: string, start: Date, end: Date): DataPoint[] => {
    const grouped = data.reduce(
      (acc, row) => {
        const dateStr = row.data
        acc[dateStr] = (acc[dateStr] || 0) + Number(row[key] || 0)
        return acc
      },
      {} as Record<string, number>,
    )

    const result: DataPoint[] = []

    // Create a new date and strip time to avoid DST issues when adding days
    const current = new Date(start.getTime())
    current.setHours(12, 0, 0, 0)
    const endLimit = new Date(end.getTime())
    endLimit.setHours(12, 0, 0, 0)

    while (current <= endLimit) {
      const dateStr = current.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        value: grouped[dateStr] || 0,
      })
      current.setDate(current.getDate() + 1)
    }
    return result
  }

  const calculateVariation = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? 100 : 0
    return ((current - prev) / prev) * 100
  }

  return [
    {
      id: 'faturamento',
      title: 'Faturamento Bruto',
      description: 'Receita total antes de deduções, impostos ou custos.',
      value: aggregate(currentData, 'faturamento_bruto'),
      format: 'currency',
      variation: calculateVariation(
        aggregate(currentData, 'faturamento_bruto'),
        aggregate(prevData, 'faturamento_bruto'),
      ),
      data: buildDaily(currentData, 'faturamento_bruto', startDate, endDate),
    },
    {
      id: 'custos',
      title: 'Custos Totais',
      description: 'Custos variáveis diretos atrelados à produção ou prestação de serviços.',
      value: aggregate(currentData, 'custos_totais'),
      format: 'currency',
      variation: calculateVariation(
        aggregate(currentData, 'custos_totais'),
        aggregate(prevData, 'custos_totais'),
      ),
      invertedLogic: true,
      data: buildDaily(currentData, 'custos_totais', startDate, endDate),
    },
    {
      id: 'despesas',
      title: 'Despesas Totais',
      description: 'Despesas operacionais fixas (administrativas, vendas, etc).',
      value: aggregate(currentData, 'despesas_totais'),
      format: 'currency',
      variation: calculateVariation(
        aggregate(currentData, 'despesas_totais'),
        aggregate(prevData, 'despesas_totais'),
      ),
      invertedLogic: true,
      data: buildDaily(currentData, 'despesas_totais', startDate, endDate),
    },
    {
      id: 'margem',
      title: 'Margem de Contribuição',
      description: 'Lucro bruto menos custos variáveis. Essencial para cobrir despesas fixas.',
      value: aggregate(currentData, 'margem_contribuicao'),
      format: 'currency',
      variation: calculateVariation(
        aggregate(currentData, 'margem_contribuicao'),
        aggregate(prevData, 'margem_contribuicao'),
      ),
      data: buildDaily(currentData, 'margem_contribuicao', startDate, endDate),
    },
    {
      id: 'resultado',
      title: 'Resultado Financeiro',
      description: 'Saldo líquido de receitas e despesas financeiras (juros, rendimentos).',
      value: aggregate(currentData, 'resultado_financeiro'),
      format: 'currency',
      variation: calculateVariation(
        aggregate(currentData, 'resultado_financeiro'),
        aggregate(prevData, 'resultado_financeiro'),
      ),
      data: buildDaily(currentData, 'resultado_financeiro', startDate, endDate),
    },
    {
      id: 'ebitda',
      title: 'EBITDA',
      description:
        'Lucro antes de juros, impostos, depreciação e amortização. Indica o potencial de geração de caixa.',
      value: aggregate(currentData, 'ebitda'),
      format: 'currency',
      variation: calculateVariation(
        aggregate(currentData, 'ebitda'),
        aggregate(prevData, 'ebitda'),
      ),
      data: buildDaily(currentData, 'ebitda', startDate, endDate),
    },
  ]
}
