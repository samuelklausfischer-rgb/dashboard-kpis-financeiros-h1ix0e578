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
  const hasData = records.length > 0

  // Calculate the sum of all KPIs over the 30-day period
  const periodSum = records.reduce(
    (acc, r) => {
      acc.faturamento_bruto += Number(r.faturamento_bruto || 0)
      acc.custos_totais += Number(r.custos_totais || 0)
      acc.despesas_totais += Number(r.despesas_totais || 0)
      acc.margem_contribuicao += Number(r.margem_contribuicao || 0)
      acc.resultado_financeiro += Number(r.resultado_financeiro || 0)
      acc.ebitda += Number(r.ebitda || 0)
      return acc
    },
    {
      faturamento_bruto: 0,
      custos_totais: 0,
      despesas_totais: 0,
      margem_contribuicao: 0,
      resultado_financeiro: 0,
      ebitda: 0,
    },
  )

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

  const kpis: KpiData[] = [
    {
      id: 'faturamento',
      title: 'Faturamento Bruto',
      description: 'Soma da receita total nos últimos 30 dias.',
      value: periodSum.faturamento_bruto,
      format: 'currency',
      variation: null,
      subtitle: 'Acumulado de 30 dias',
      data: buildDaily('faturamento_bruto'),
    },
    {
      id: 'custos',
      title: 'Custos Totais',
      description: 'Soma dos custos variáveis diretos nos últimos 30 dias.',
      value: periodSum.custos_totais,
      format: 'currency',
      variation: null,
      invertedLogic: true,
      subtitle: 'Acumulado de 30 dias',
      data: buildDaily('custos_totais'),
    },
    {
      id: 'despesas',
      title: 'Despesas Totais',
      description: 'Soma das despesas operacionais fixas nos últimos 30 dias.',
      value: periodSum.despesas_totais,
      format: 'currency',
      variation: null,
      invertedLogic: true,
      subtitle: 'Acumulado de 30 dias',
      data: buildDaily('despesas_totais'),
    },
    {
      id: 'margem',
      title: 'Margem de Contribuição',
      description: 'Soma da margem de contribuição nos últimos 30 dias.',
      value: periodSum.margem_contribuicao,
      format: 'currency',
      variation: null,
      subtitle: 'Acumulado de 30 dias',
      data: buildDaily('margem_contribuicao'),
    },
    {
      id: 'resultado',
      title: 'Resultado Financeiro',
      description: 'Soma do saldo líquido de receitas e despesas financeiras nos últimos 30 dias.',
      value: periodSum.resultado_financeiro,
      format: 'currency',
      variation: null,
      subtitle: 'Acumulado de 30 dias',
      data: buildDaily('resultado_financeiro'),
    },
    {
      id: 'ebitda',
      title: 'EBITDA',
      description: 'Soma do EBITDA gerado nos últimos 30 dias.',
      value: periodSum.ebitda,
      format: 'currency',
      variation: null,
      subtitle: 'Acumulado de 30 dias',
      data: buildDaily('ebitda'),
    },
  ]

  return { unidadeName, kpis, hasData }
}
