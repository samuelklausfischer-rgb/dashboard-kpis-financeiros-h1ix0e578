import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Building, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200 animate-fade-in-up">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white shadow-sm">
              <Building className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className="text-slate-500">
            Faça login para acessar seu painel financeiro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@empresa.com.br"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-visible:ring-blue-600"
              />
            </div>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">
                  Senha
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-blue-600"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
              <Lock className="mr-2 h-4 w-4" /> Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            Qualquer email e senha funcionarão neste ambiente de teste.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
