import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from '@/pages/Index'
import NotFound from '@/pages/NotFound'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import PerformanceUnidade from '@/pages/PerformanceUnidade'
import UnidadeDetails from '@/pages/UnidadeDetails'
import Configuracoes from '@/pages/Configuracoes'
import { AuthProvider } from '@/hooks/use-auth'
import { DateRangeProvider } from '@/contexts/DateRangeContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <DateRangeProvider>
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/performance-unidade" element={<PerformanceUnidade />} />
                <Route path="/unidade/:id" element={<UnidadeDetails />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </DateRangeProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
