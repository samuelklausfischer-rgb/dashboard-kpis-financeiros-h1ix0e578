import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProtectedRoute() {
  const { user, userRole, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="animate-pulse">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 animate-fade-in">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Acesso Negado</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Apenas administradores podem acessar esta área do painel financeiro. Se você acredita
            que isto é um erro, contate o suporte.
          </p>
          <Button
            onClick={() => signOut()}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
          >
            Sair e voltar para o Login
          </Button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
