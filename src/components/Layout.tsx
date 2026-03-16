import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50 min-h-screen">
        <Header />
        <main className="p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
