import React, { useState, useEffect, useCallback } from 'react'
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Search, Eye, RefreshCw, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LeadsTab() {
  const [leads, setLeads] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadLeads = useCallback(async () => {
    setIsLoading(true)
    try {
      const [erp, cert, geral] = await Promise.all([
        supabase.from('leads_erp').select('*').order('created_at', { ascending: false }),
        supabase.from('leads_certificados').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('data_criacao', { ascending: false }),
      ])
      const arr: any[] = []

      erp.data?.forEach((l) =>
        arr.push({
          id: `erp-${l.id}`,
          type: 'Sistema ERP',
          name: l.empresa || l.nome || 'Não informado',
          email: l.email,
          phone: l.telefone,
          date: l.created_at || l.data_contato,
          raw: l,
        }),
      )

      cert.data?.forEach((l) =>
        arr.push({
          id: `cert-${l.id}`,
          type: 'Certificados',
          name: l.nome || l.email?.split('@')[0] || 'Lead',
          email: l.email,
          phone: l.telefone,
          date: l.created_at || l.data_contato,
          raw: l,
        }),
      )

      geral.data?.forEach((l) =>
        arr.push({
          id: `geral-${l.id}`,
          type: 'Contato Geral',
          name: l.nome,
          email: l.email,
          phone: l.telefone,
          date: l.data_criacao,
          raw: l,
        }),
      )

      setLeads(arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (err) {
      console.error('Erro ao carregar leads:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  const filtered = leads.filter(
    (l) =>
      (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.type || '').toLowerCase().includes(search.toLowerCase()),
  )

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Sistema ERP':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'Certificados':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20'
    }
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/10">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-background"
          />
        </div>
        <Button variant="outline" size="sm" onClick={loadLeads} disabled={isLoading}>
          <RefreshCw className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
          Atualizar
        </Button>
      </div>
      <div className="overflow-x-auto min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Carregando leads...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Inbox className="w-12 h-12 mb-4 text-muted-foreground/50" />
            <p>Nenhum lead encontrado.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Serviço Solicitado</TableHead>
                <TableHead>Nome / Empresa</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id} className="group">
                  <TableCell className="text-sm whitespace-nowrap">
                    {format(new Date(l.date), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap',
                        getTypeStyle(l.type),
                      )}
                    >
                      {l.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{l.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{l.email}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{l.phone || '-'}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="w-4 h-4 mr-2" /> Detalhes
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-md">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2">
                            Detalhes do Lead
                            <span
                              className={cn(
                                'text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border',
                                getTypeStyle(l.type),
                              )}
                            >
                              {l.type}
                            </span>
                          </SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
                          <div className="space-y-6">
                            {/* Data section */}
                            <div className="space-y-1">
                              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Informações da Solicitação
                              </h4>
                              <div className="grid grid-cols-2 gap-4 mt-2 p-4 bg-muted/30 rounded-lg border">
                                <div>
                                  <span className="text-xs text-muted-foreground block mb-1">
                                    Data
                                  </span>
                                  <span className="text-sm font-medium">
                                    {format(new Date(l.date), 'dd/MM/yyyy HH:mm')}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-muted-foreground block mb-1">
                                    Serviço
                                  </span>
                                  <span className="text-sm font-medium">{l.type}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Dados do Cliente
                              </h4>
                              <div className="space-y-4 p-4 bg-muted/10 rounded-lg border">
                                {l.type === 'Sistema ERP' && (
                                  <>
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        Empresa
                                      </span>
                                      <span className="text-sm font-medium">
                                        {l.raw.empresa || '-'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        Nome do Contato
                                      </span>
                                      <span className="text-sm font-medium">
                                        {l.raw.nome || '-'}
                                      </span>
                                    </div>
                                  </>
                                )}

                                {l.type === 'Certificados' && (
                                  <>
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        Nome
                                      </span>
                                      <span className="text-sm font-medium">
                                        {l.raw.nome || '-'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        Tipo de Certificado
                                      </span>
                                      <span className="text-sm font-medium">
                                        {l.raw.tipo_certificado || '-'}
                                      </span>
                                    </div>
                                  </>
                                )}

                                {l.type === 'Contato Geral' && (
                                  <>
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        Nome
                                      </span>
                                      <span className="text-sm font-medium">
                                        {l.raw.nome || '-'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        Empresa
                                      </span>
                                      <span className="text-sm font-medium">
                                        {l.raw.empresa || '-'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        Estágio
                                      </span>
                                      <span className="text-sm font-medium">
                                        {l.raw.estagio || '-'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        Observações
                                      </span>
                                      <p className="text-sm whitespace-pre-wrap bg-background p-3 rounded border mt-1">
                                        {l.raw.observacoes || 'Nenhuma observação informada.'}
                                      </p>
                                    </div>
                                  </>
                                )}

                                <div className="pt-2 border-t mt-4">
                                  <div className="grid gap-4 mt-2">
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        E-mail
                                      </span>
                                      <a
                                        href={`mailto:${l.raw.email}`}
                                        className="text-sm font-medium text-primary hover:underline"
                                      >
                                        {l.raw.email}
                                      </a>
                                    </div>
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        WhatsApp / Telefone
                                      </span>
                                      {l.raw.telefone ? (
                                        <a
                                          href={`https://wa.me/55${l.raw.telefone.replace(/\D/g, '')}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-sm font-medium text-primary hover:underline"
                                        >
                                          {l.raw.telefone}
                                        </a>
                                      ) : (
                                        <span className="text-sm font-medium">-</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
