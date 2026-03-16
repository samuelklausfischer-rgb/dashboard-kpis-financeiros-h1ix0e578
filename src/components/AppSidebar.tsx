import { BarChart3, Settings, PieChart, Wallet, LogOut, Building } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: BarChart3,
    isActive: true,
  },
  {
    title: 'Relatórios',
    url: '#',
    icon: PieChart,
  },
  {
    title: 'Transações',
    url: '#',
    icon: Wallet,
  },
  {
    title: 'Configurações',
    url: '#',
    icon: Settings,
  },
]

export function AppSidebar() {
  const { logout } = useAuth()

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-600 text-white">
            <Building className="h-5 w-5" />
          </div>
          <span className="font-semibold text-slate-900 text-lg tracking-tight">FinDashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-medium">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 data-[active=true]:font-semibold"
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-12 w-full justify-start text-slate-600 hover:bg-slate-100"
            >
              <a href="#">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=4"
                    alt="Usuário"
                  />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium text-slate-900 leading-none mb-1">
                    Maria Costa
                  </span>
                  <span className="text-xs text-slate-500 leading-none">Diretora Financeira</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 mt-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair da conta</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
