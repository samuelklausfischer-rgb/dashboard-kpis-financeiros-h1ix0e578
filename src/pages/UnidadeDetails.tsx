import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnidadeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-900 border-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            Detalhes da Unidade
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Visualizando informações detalhadas da unidade selecionada.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm min-h-[450px]">
        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
          <Building2 className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Área em Desenvolvimento</h3>
        <p className="text-slate-500 max-w-md leading-relaxed mb-6">
          A visualização do perfil detalhado e gráficos individuais desta unidade de negócio (ID:{' '}
          <span className="font-mono text-xs bg-slate-100 px-1 rounded">{id}</span>) será
          implementada nas próximas atualizações do sistema.
        </p>
        <Button onClick={() => navigate(-1)} variant="secondary" className="px-8">
          Voltar para a lista
        </Button>
      </div>
    </div>
  )
}
