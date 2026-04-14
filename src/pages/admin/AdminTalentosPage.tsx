import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Download, Search, Filter, LogOut, Briefcase, Mail, Phone, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminTalentosPage() {
  const [session, setSession] = useState<any>(null)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [candidates, setCandidates] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const isAdminSessionActive = sessionStorage.getItem('admin_session_active')

      if (!isAdminSessionActive) {
        await supabase.auth.signOut()
        setSession(null)
        setLoading(false)
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        setLoading(false)
        if (session) fetchCandidates()
      }
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
        if (session) fetchCandidates()
      } else {
        setSession(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCandidates = async () => {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar talentos')
      return
    }
    setCandidates(data || [])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    // Mapping the custom required login to a valid supabase auth email
    let email = login
    if (login === 'eradigital') email = 'eradigital@eradigital.com.br'

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Credenciais inválidas. Verifique o login e senha informados.')
    } else {
      sessionStorage.setItem('admin_session_active', 'true')
      toast.success('Login administrativo realizado com sucesso!')
    }
    setAuthLoading(false)
  }

  const handleLogout = async () => {
    sessionStorage.removeItem('admin_session_active')
    await supabase.auth.signOut()
    setSession(null)
    toast.success('Você saiu do sistema.')
  }

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Profissão', 'Data de Envio', 'Status', 'DISC']
    const csvData = filteredCandidates.map((c) => [
      c.name,
      c.email,
      c.resume_data?.personal?.telefone || '',
      c.profession || '',
      format(new Date(c.created_at), 'dd/MM/yyyy HH:mm'),
      c.status,
      c.disc_result?.type || '',
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `talentos_eradigital_${format(new Date(), 'yyyyMMdd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Exportação do banco de talentos concluída!')
  }

  const filteredCandidates = candidates.filter((c) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.profession && c.profession.toLowerCase().includes(term))
    const matchesStatus = statusFilter ? c.status === statusFilter : true
    return matchesSearch && matchesStatus
  })

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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Acesso Restrito</h1>
            <p className="text-sm text-muted-foreground">
              Área administrativa do Banco de Talentos
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Login</label>
              <Input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Ex: eradigital"
                required
                autoFocus
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={authLoading}
            >
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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Banco de Talentos
              </h1>
              <p className="text-sm text-muted-foreground">
                Dashboard exclusivo para gestão de currículos recebidos
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="flex-1 md:flex-none"
              disabled={filteredCandidates.length === 0}
            >
              <Download className="w-4 h-4 mr-2" /> Exportar CSV
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2 md:mr-0" /> <span className="md:hidden">Sair</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 bg-muted/10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar candidato por nome, email ou profissão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background h-10"
              />
            </div>
            <div className="w-full sm:w-56 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 pl-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="Novo">Novo</option>
                <option value="Entrevistado">Entrevistado</option>
                <option value="Contratado">Contratado</option>
                <option value="Rejeitado">Rejeitado</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[300px]">Candidato</TableHead>
                  <TableHead>Profissão</TableHead>
                  <TableHead>Data de Envio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Perfil DISC</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-muted-foreground/50" />
                        <p>Nenhum candidato encontrado com os filtros atuais.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell>
                        <div className="font-semibold text-foreground mb-1">{c.name}</div>
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center text-xs text-muted-foreground">
                            <Mail className="w-3 h-3 mr-1" /> {c.email}
                          </span>
                          {c.resume_data?.personal?.telefone && (
                            <span className="inline-flex items-center text-xs text-muted-foreground">
                              <Phone className="w-3 h-3 mr-1" /> {c.resume_data.personal.telefone}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                          {c.profession || 'Não informado'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(c.created_at), 'dd MMM yyyy', { locale: ptBR })}
                        <div className="text-xs opacity-75">
                          {format(new Date(c.created_at), 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                            c.status === 'Novo'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : c.status === 'Contratado'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : c.status === 'Rejeitado'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {c.disc_result?.type ? (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-primary">{c.disc_result.type}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">
                            Não realizado
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`mailto:${c.email}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Mail className="w-4 h-4 mr-2" /> Contatar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 border-t bg-muted/10 text-xs text-muted-foreground text-right">
            Mostrando {filteredCandidates.length} candidato(s) no banco de talentos
          </div>
        </div>
      </div>
    </div>
  )
}
