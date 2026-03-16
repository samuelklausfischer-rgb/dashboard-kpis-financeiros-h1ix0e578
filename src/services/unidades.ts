import { supabase } from '@/lib/supabase/client'
import { format, subDays } from 'date-fns'
import { UnidadePerformance } from '@/types/unidades'
import { KpiData, DataPoint } from '@/types/dashboard'

export async function fetchUnidadesPerformance(
  startDate: Date,
  endDate: Date,
): Promise<UnidadePerformance[]> {
  const startDateStr = format(startDate, 'yyyy-MM-dd')
  const endDateStr = format(endDate, 'yyyy-MM-dd')

  // Fetch all active units
  const { data: unidades, error: unError } = await supabase
    .from('unidades')
    .select('*')
    .eq('ativa', true)
    .order('nome')

  if (unError || !unidades) {
    console.error('Error fetching unidades:', unError)
    return []
  }

  // Fetch KPIs for the given period
  const { data: kpis, error: kpiError } = await supabase
    .from('kpis_diarios')
    .select('*')
    .gte('data', startDateStr)
    .lte('data', endDateStr)

  if (kpiError) {
    console.error('Error fetching KPIs:', kpiError)
    return []
  }

  // Map and aggregate KPIs to units
  const kpiMap = new Map<string, any>()
  for (const k of kpis || []) {
    if (!k.unidade_id) continue
    const existing = kpiMap.get(k.unidade_id) || {
      faturamento_bruto: 0,
      custos_totais: 0,
      despesas_totais: 0,
      margem_contribuicao: 0,
      resultado_financeiro: 0,
      ebitda: 0,
      count: 0,
    }

    existing.faturamento_bruto += Number(k.faturamento_bruto || 0)
    existing.custos_totais += Number(k.custos_totais || 0)
    existing.despesas_totais += Number(k.despesas_totais || 0)
    existing.margem_contribuicao += Number(k.margem_contribuicao || 0)
    existing.resultado_financeiro += Number(k.resultado_financeiro || 0)
    existing.ebitda += Number(k.ebitda || 0)
    existing.count += 1

    kpiMap.set(k.unidade_id, existing)
  }

  return unidades.map((u) => {
    const kpi = kpiMap.get(u.id)
    return {
      id: u.id,
      nome: u.nome,
      tipo: u.tipo as 'matriz' | 'filial',
      kpis:
        kpi && kpi.count > 0
          ? {
              faturamento_bruto: kpi.faturamento_bruto,
              custos_totais: kpi.custos_totais,
              despesas_totais: kpi.despesas_totais,
              margem_contribuicao: kpi.margem_contribuicao,
              resultado_financeiro: kpi.resultado_financeiro,
              ebitda: kpi.ebitda,
            }
          : null,
    }
  })
}

export async function fetchUnidadeDetails(
  unidadeId: string,
  targetDate: Date = new Date(),
): Promise<{ unidadeName: string; kpis: KpiData[]; hasData: boolean }> {
  const targetDateStr = format(targetDate, 'yyyy-MM-dd')
  const startDateStr = format(subDays(targetDate, 30), 'yyyy-MM-dd')

  const [unidadeRes, kpisRes] = await Promise.all([
    supabase.from('unidades').select('nome').eq('id', unidadeId).single(),
    supabase
      .from('kpis_diarios')
      .select('*')
      .eq('unidade_id', unidadeId)
      .gte('data', startDateStr)
      .lte('data', targetDateStr)
      .order('data', { ascending: true }),
  ])

  const unidadeName = unidadeRes.data?.nome || 'Unidade não encontrada'
  const records = kpisRes.data || []

  // Sort by date descending to find the most recent entry
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  )
  const latestRecord = sortedRecords.length > 0 ? sortedRecords[0] : null
  const hasData = !!latestRecord

  let prevRecord = null
  if (latestRecord) {
    // Find the record immediately preceding the latest record chronologically
    const latestDateStr = latestRecord.data
    const recordsBeforeLatest = sortedRecords.filter((r) => r.data < latestDateStr)
    prevRecord = recordsBeforeLatest.length > 0 ? recordsBeforeLatest[0] : null
  }

  const todayAgg = latestRecord || {
    faturamento_bruto: 0,
    custos_totais: 0,
    despesas_totais: 0,
    margem_contribuicao: 0,
    resultado_financeiro: 0,
    ebitda: 0,
  }

  const prevAgg = prevRecord || {
    faturamento_bruto: 0,
    custos_totais: 0,
    despesas_totais: 0,
    margem_contribuicao: 0,
    resultado_financeiro: 0,
    ebitda: 0,
  }

  const recordsByDate = records.reduce(
    (acc, r) => {
      acc[r.data] = r
      return acc
    },
    {} as Record<string, any>,
  )

  const buildDaily = (key: string): DataPoint[] => {
    const result: DataPoint[] = []
    for (let i = 30; i >= 0; i--) {
      const d = format(subDays(targetDate, i), 'yyyy-MM-dd')
      result.push({
        date: d,
        value: Number(recordsByDate[d]?.[key] || 0),
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
      value: Number(todayAgg.faturamento_bruto),
      format: 'currency',
      variation: calcVar(Number(todayAgg.faturamento_bruto), Number(prevAgg.faturamento_bruto)),
      data: buildDaily('faturamento_bruto'),
    },
    {
      id: 'custos',
      title: 'Custos Totais',
      description: 'Custos variáveis diretos atrelados à produção ou prestação de serviços.',
      value: Number(todayAgg.custos_totais),
      format: 'currency',
      variation: calcVar(Number(todayAgg.custos_totais), Number(prevAgg.custos_totais)),
      invertedLogic: true,
      data: buildDaily('custos_totais'),
    },
    {
      id: 'despesas',
      title: 'Despesas Totais',
      description: 'Despesas operacionais fixas (administrativas, vendas, etc).',
      value: Number(todayAgg.despesas_totais),
      format: 'currency',
      variation: calcVar(Number(todayAgg.despesas_totais), Number(prevAgg.despesas_totais)),
      invertedLogic: true,
      data: buildDaily('despesas_totais'),
    },
    {
      id: 'margem',
      title: 'Margem de Contribuição',
      description: 'Lucro bruto menos custos variáveis. Essencial para cobrir despesas fixas.',
      value: Number(todayAgg.margem_contribuicao),
      format: 'currency',
      variation: calcVar(Number(todayAgg.margem_contribuicao), Number(prevAgg.margem_contribuicao)),
      data: buildDaily('margem_contribuicao'),
    },
    {
      id: 'resultado',
      title: 'Resultado Financeiro',
      description: 'Saldo líquido de receitas e despesas financeiras (juros, rendimentos).',
      value: Number(todayAgg.resultado_financeiro),
      format: 'currency',
      variation: calcVar(
        Number(todayAgg.resultado_financeiro),
        Number(prevAgg.resultado_financeiro),
      ),
      data: buildDaily('resultado_financeiro'),
    },
    {
      id: 'ebitda',
      title: 'EBITDA',
      description:
        'Lucro antes de juros, impostos, depreciação e amortização. Indica o potencial de geração de caixa.',
      value: Number(todayAgg.ebitda),
      format: 'currency',
      variation: calcVar(Number(todayAgg.ebitda), Number(prevAgg.ebitda)),
      data: buildDaily('ebitda'),
    },
  ]

  return { unidadeName, kpis, hasData }
}
