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
