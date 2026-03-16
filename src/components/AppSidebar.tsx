import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Settings, Users, Building2, LogOut } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Unidades', href: '/unidades', icon: Building2 },
    { name: 'Usuários', href: '/usuarios', icon: Users },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center px-6 font-bold text-lg border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 text-blue-600">
          <Building2 className="h-6 w-6" />
          <span>FinanceKPI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarMenu className="px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <SidebarMenuItem key={item.name} className="py-0.5">
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.name}
                  className={cn(
                    'w-full justify-start rounded-lg font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )}
                >
                  <Link to={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-slate-900 truncate">
              {user?.email?.split('@')[0]}
            </span>
            <span className="text-xs text-slate-500 truncate">{user?.email}</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="w-full justify-start text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
