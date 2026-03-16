import * as React from 'react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function DateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal border-slate-200 shadow-subtle hover:bg-slate-50 text-slate-700',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd 'de' MMM, yyyy", { locale: ptBR })} -{' '}
                  {format(date.to, "dd 'de' MMM, yyyy", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "dd 'de' MMM, yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
