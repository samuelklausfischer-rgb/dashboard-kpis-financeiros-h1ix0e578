import { SidebarTrigger } from '@/components/ui/sidebar'
import { DateRangePicker } from '@/components/date-range-picker'
import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export function Header() {
  const { signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
        <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">
          Dashboard Financeiro
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <DateRangePicker className="hidden md:flex" />

        <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="text-slate-600 hover:text-rose-600 hover:bg-rose-50 border-slate-200 ml-1 hidden sm:flex"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  )
}
