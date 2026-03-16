import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Building2 } from 'lucide-react'
import { fetchUnidadesPerformance } from '@/services/unidades'
import { UnidadePerformance } from '@/types/unidades'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'

export default function PerformanceUnidade() {
  const [data, setData] = useState<UnidadePerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState('todos')
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    async function loadData() {
      setLoading(true)
      const result = await fetchUnidadesPerformance(new Date())
      if (mounted) {
        setData(result)
        setLoading(false)
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [])

  const filteredData = useMemo(() => {
    return data.filter((u) => {
      const matchName = u.nome.toLowerCase().includes(searchTerm.toLowerCase())
      const matchTipo = tipoFilter === 'todos' || u.tipo === tipoFilter
      return matchName && matchTipo
    })
  }, [data, searchTerm, tipoFilter])

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Performance por Unidade
        </h2>
        <p className="text-slate-500 mt-1 text-sm">
          Analise o desempenho financeiro de todas as unidades de negócio da organização.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar unidade por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-[220px]">
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              <SelectItem value="matriz">Matriz</SelectItem>
              <SelectItem value="filial">Filial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="font-semibold text-slate-700 w-[280px]">
                Nome da Unidade
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-700">
                Faturamento Bruto
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-700">
                Custos Totais
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-700">
                Despesas Totais
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-700">
                Margem de Contribuição
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-700">
                Resultado Financeiro
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-700">EBITDA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Building2 className="h-10 w-10 mb-3 text-slate-300" />
                    <p className="text-lg font-medium text-slate-900">Nenhuma unidade encontrada</p>
                    <p className="text-sm">
                      Tente ajustar os filtros de busca para encontrar o que procura.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((unidade) => (
                <TableRow
                  key={unidade.id}
                  className="cursor-pointer hover:bg-slate-50/80 transition-colors group"
                  onClick={() => navigate(`/unidade/${unidade.id}`)}
                >
                  <TableCell className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="truncate">{unidade.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-emerald-600">
                    {unidade.kpis ? formatCurrency(unidade.kpis.faturamento_bruto) : '-'}
                  </TableCell>
                  <TableCell className="text-right text-rose-600">
                    {unidade.kpis ? formatCurrency(unidade.kpis.custos_totais) : '-'}
                  </TableCell>
                  <TableCell className="text-right text-rose-600">
                    {unidade.kpis ? formatCurrency(unidade.kpis.despesas_totais) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium text-blue-600">
                    {unidade.kpis ? formatCurrency(unidade.kpis.margem_contribuicao) : '-'}
                  </TableCell>
                  <TableCell className="text-right text-slate-700">
                    {unidade.kpis ? formatCurrency(unidade.kpis.resultado_financeiro) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900">
                    {unidade.kpis ? formatCurrency(unidade.kpis.ebitda) : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
