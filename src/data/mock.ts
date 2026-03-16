export type DataPoint = {
  date: string
  value: number
}

export type KpiData = {
  id: string
  title: string
  description: string
  value: number
  format: 'currency' | 'percent' | 'number'
  variation: number
  invertedLogic?: boolean // If true, positive variation is bad (red)
  data: DataPoint[]
}

// Helper to generate realistic sparkline data
const generateTrendData = (
  baseValue: number,
  volatility: number,
  trend: 'up' | 'down' | 'flat',
  days: number = 30,
): DataPoint[] => {
  const data: DataPoint[] = []
  let currentValue = baseValue

  const today = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Add random volatility
    const change = Math.random() * volatility * 2 - volatility

    // Apply trend
    const trendFactor = trend === 'up' ? volatility * 0.2 : trend === 'down' ? -volatility * 0.2 : 0

    currentValue = Math.max(0, currentValue + change + trendFactor)

    data.push({
      date: date.toISOString().split('T')[0],
      value: Number(currentValue.toFixed(2)),
    })
  }

  return data
}

export const dashboardKpis: KpiData[] = [
  {
    id: 'faturamento',
    title: 'Faturamento Bruto',
    description: 'Receita total antes de deduções, impostos ou custos.',
    value: 1254300.0,
    format: 'currency',
    variation: 12.5,
    data: generateTrendData(30000, 5000, 'up'),
  },
  {
    id: 'custos',
    title: 'Custos Totais',
    description: 'Custos variáveis diretos atrelados à produção ou prestação de serviços.',
    value: 452100.0,
    format: 'currency',
    variation: 5.2,
    invertedLogic: true, // Costs going up is bad
    data: generateTrendData(15000, 2000, 'up'),
  },
  {
    id: 'despesas',
    title: 'Despesas Totais',
    description: 'Despesas operacionais fixas (administrativas, vendas, etc).',
    value: 298500.0,
    format: 'currency',
    variation: -2.1,
    invertedLogic: true, // Expenses going down is good
    data: generateTrendData(10000, 1000, 'down'),
  },
  {
    id: 'margem',
    title: 'Margem de Contribuição',
    description: 'Lucro bruto menos custos variáveis. Essencial para cobrir despesas fixas.',
    value: 802200.0,
    format: 'currency',
    variation: 15.3,
    data: generateTrendData(15000, 3000, 'up'),
  },
  {
    id: 'resultado',
    title: 'Resultado Financeiro',
    description: 'Saldo líquido de receitas e despesas financeiras (juros, rendimentos).',
    value: 45600.0,
    format: 'currency',
    variation: 8.4,
    data: generateTrendData(1000, 500, 'flat'),
  },
  {
    id: 'ebitda',
    title: 'EBITDA',
    description:
      'Lucro antes de juros, impostos, depreciação e amortização. Indica o potencial de geração de caixa.',
    value: 549300.0,
    format: 'currency',
    variation: 18.2,
    data: generateTrendData(14000, 2500, 'up'),
  },
]
