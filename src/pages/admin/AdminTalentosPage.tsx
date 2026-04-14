import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase, LogOut, LayoutDashboard } from 'lucide-react'
import { toast } from 'sonner'
import CandidatesTab from './components/CandidatesTab'
import LeadsTab from './components/LeadsTab'
import ParceirosTab from './components/ParceirosTab'

export default function AdminTalentosPage() {
  const [session, setSession] = useState<any>(null)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const isAdminSessionActive = sessionStorage.getItem('admin_session_active')
      if (!isAdminSessionActive) {
        await supabase.auth.signOut()
        setSession(null)
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
      }
      setLoading(false)
    }
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const isAdminSessionActive = sessionStorage.getItem('admin_session_active')
      if (event === 'SIGNED_IN' && !isAdminSessionActive) {
        sessionStorage.setItem('admin_session_active', 'true')
      }
      if (sessionStorage.getItem('admin_session_active')) {
        setSession(session)
      } else {
        setSession(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    let email = login
    if (login === 'eradigital') email = 'eradigital@eradigital.com.br'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Credenciais inválidas.')
    } else {
      sessionStorage.setItem('admin_session_active', 'true')
      toast.success('Login realizado com sucesso!')
    }
    setAuthLoading(false)
  }

  const handleLogout = async () => {
    sessionStorage.removeItem('admin_session_active')
    await supabase.auth.signOut()
    setSession(null)
    toast.success('Você saiu do sistema.')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4 animate-fade-in-up">
        <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-2xl shadow-xl border border-border/50">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Acesso Restrito</h1>
            <p className="text-sm text-muted-foreground">Área administrativa</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Login</label>
              <Input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Ex: eradigital"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={authLoading}>
              {authLoading ? 'Verificando...' : 'Entrar no Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    )
  }

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
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>

        <Tabs defaultValue="talentos" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="talentos">Banco de Talentos</TabsTrigger>
            <TabsTrigger value="leads">Central de Leads</TabsTrigger>
            <TabsTrigger value="parceiros">Portal do Parceiro</TabsTrigger>
          </TabsList>
          <TabsContent value="talentos" className="mt-0 outline-none">
            <CandidatesTab />
          </TabsContent>
          <TabsContent value="leads" className="mt-0 outline-none">
            <LeadsTab />
          </TabsContent>
          <TabsContent value="parceiros" className="mt-0 outline-none">
            <ParceirosTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
