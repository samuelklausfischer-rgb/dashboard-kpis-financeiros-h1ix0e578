import { useEffect, useState } from 'react'
import { Users, Shield, User as UserIcon, CheckCircle2, XCircle } from 'lucide-react'
import { fetchUsuarios, Usuario } from '@/services/usuarios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      setLoading(true)
      const data = await fetchUsuarios()
      if (mounted) {
        setUsuarios(data)
        setLoading(false)
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          Usuários
        </h2>
        <p className="text-slate-500 mt-1 text-sm">
          Gerencie o acesso e as permissões dos usuários no sistema.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow className="hover:bg-slate-50/80">
                <TableHead className="font-semibold text-slate-700 h-11 w-[300px]">
                  Usuário
                </TableHead>
                <TableHead className="font-semibold text-slate-700 h-11">E-mail</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11">Função</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 w-[150px]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-32 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold shrink-0">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate">{user.email.split('@')[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {user.role === 'admin' ? (
                          <Shield className="h-4 w-4 text-blue-600" />
                        ) : (
                          <UserIcon className="h-4 w-4 text-slate-400" />
                        )}
                        <span
                          className={
                            user.role === 'admin' ? 'font-medium text-slate-900' : 'text-slate-600'
                          }
                        >
                          {user.role === 'admin' ? 'Administrador' : 'Visualizador'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.ativo ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-600 border-slate-200"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
