import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutDashboard, LogOut } from 'lucide-react'
import CandidatesTab from './components/CandidatesTab'
import LeadsTab from './components/LeadsTab'

export default function AdminTalentosPage() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-muted/20 py-10">
      <div className="container mx-auto px-4 max-w-7xl space-y-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">Gestão de Talentos e Central de Leads</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>

        <Tabs defaultValue="talentos" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="talentos">Banco de Talentos</TabsTrigger>
            <TabsTrigger value="leads">Central de Leads</TabsTrigger>
          </TabsList>
          <TabsContent value="talentos" className="mt-0 outline-none">
            <CandidatesTab />
          </TabsContent>
          <TabsContent value="leads" className="mt-0 outline-none">
            <LeadsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
