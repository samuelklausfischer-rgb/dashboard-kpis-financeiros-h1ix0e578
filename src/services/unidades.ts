import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { UnidadePerformance } from '@/types/unidades'

export async function fetchUnidadesPerformance(
  date: Date = new Date(),
): Promise<UnidadePerformance[]> {
  const dateStr = format(date, 'yyyy-MM-dd')

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

  // Fetch KPIs for the given date
  const { data: kpis, error: kpiError } = await supabase
    .from('kpis_diarios')
    .select('*')
    .eq('data', dateStr)

  if (kpiError) {
    console.error('Error fetching KPIs:', kpiError)
    return []
  }

  // Map KPIs to units efficiently
  const kpiMap = new Map(kpis.map((k) => [k.unidade_id, k]))

  return unidades.map((u) => {
    const kpi = kpiMap.get(u.id)
    return {
      id: u.id,
      nome: u.nome,
      tipo: u.tipo as 'matriz' | 'filial',
      kpis: kpi
        ? {
            faturamento_bruto: Number(kpi.faturamento_bruto),
            custos_totais: Number(kpi.custos_totais),
            despesas_totais: Number(kpi.despesas_totais),
            margem_contribuicao: Number(kpi.margem_contribuicao),
            resultado_financeiro: Number(kpi.resultado_financeiro),
            ebitda: Number(kpi.ebitda),
          }
        : null,
    }
  })
}
