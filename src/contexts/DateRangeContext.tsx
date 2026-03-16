import { createContext, useContext, useState, ReactNode } from 'react'
import { DateRange } from 'react-day-picker'
import { subDays } from 'date-fns'

interface DateRangeContextType {
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined)

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  )
}

export const useDateRange = () => {
  const context = useContext(DateRangeContext)
  if (!context) throw new Error('useDateRange must be used within DateRangeProvider')
  return context
}
