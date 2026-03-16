export type UnidadePerformance = {
  id: string
  nome: string
  tipo: 'matriz' | 'filial'
  kpis: {
    faturamento_bruto: number
    custos_totais: number
    despesas_totais: number
    margem_contribuicao: number
    resultado_financeiro: number
    ebitda: number
  } | null
}
