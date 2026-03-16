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
  variation: number | null
  invertedLogic?: boolean
  data: DataPoint[]
}
