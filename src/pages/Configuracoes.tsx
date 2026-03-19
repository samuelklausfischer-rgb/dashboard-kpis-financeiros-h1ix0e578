import { Settings, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Configuracoes() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          Configurações
        </h2>
        <p className="text-slate-500 mt-1 text-sm">
          Gerencie as configurações da sua conta e preferências do sistema.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Perfil de Usuário</CardTitle>
            <CardDescription>Atualize suas informações pessoais e de exibição.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="name" className="text-slate-700">
                Nome de exibição
              </Label>
              <Input
                id="name"
                placeholder="Seu nome"
                defaultValue="Administrador"
                className="focus-visible:ring-blue-600"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-slate-700">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                defaultValue="admin@example.com"
                disabled
                className="bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500">
                O e-mail associado à conta não pode ser alterado por aqui.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-4">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Preferências do Sistema</CardTitle>
            <CardDescription>Personalize como o dashboard se comporta para você.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="theme" className="text-slate-700">
                Tema Visual
              </Label>
              <Input
                id="theme"
                value="Modo Claro (Padrão)"
                disabled
                className="bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="notifications" className="text-slate-700">
                Notificações por E-mail
              </Label>
              <Input
                id="notifications"
                value="Apenas Alertas Críticos"
                disabled
                className="bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Para opções avançadas de sistema, acesse o painel de administração corporativo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
