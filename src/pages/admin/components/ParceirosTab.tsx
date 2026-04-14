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
import { Search, Eye, RefreshCw, Handshake, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function ParceirosTab() {
  const [leads, setLeads] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadLeads = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('leads_parceiros')
        .select('*')
        .order('data_criacao', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (err) {
      console.error('Erro ao carregar parceiros:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('leads_parceiros').delete().eq('id', id)
      if (error) throw error

      toast.success('Parceiro excluído com sucesso!')
      setLeads((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      console.error(err)
      toast.error('Erro ao excluir parceiro')
    }
  }

  const filtered = leads.filter(
    (l) =>
      (l.nome || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.profissao || '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/10">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou profissão..."
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
            <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Carregando parceiros...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Handshake className="w-12 h-12 mb-4 text-muted-foreground/50" />
            <p>Nenhuma solicitação de parceria encontrada.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Profissão / Empresa</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id} className="group">
                  <TableCell className="text-sm whitespace-nowrap">
                    {format(new Date(l.data_criacao), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{l.nome}</TableCell>
                  <TableCell className="text-sm">{l.profissao}</TableCell>
                  <TableCell>
                    <div className="text-sm">{l.email}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{l.telefone || '-'}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-2" /> Detalhes
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md">
                          <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                              Detalhes do Parceiro
                              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-600 border-amber-500/20">
                                Parceria
                              </span>
                            </SheetTitle>
                          </SheetHeader>
                          <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
                            <div className="space-y-6">
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
                                      {format(new Date(l.data_criacao), 'dd/MM/yyyy HH:mm')}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground block mb-1">
                                      Profissão / Empresa
                                    </span>
                                    <span className="text-sm font-medium">{l.profissao}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                  Dados de Contato
                                </h4>
                                <div className="space-y-4 p-4 bg-muted/10 rounded-lg border">
                                  <div>
                                    <span className="text-xs text-muted-foreground block mb-1">
                                      Nome Completo
                                    </span>
                                    <span className="text-sm font-medium">{l.nome}</span>
                                  </div>
                                  <div className="grid gap-4 mt-2">
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        E-mail
                                      </span>
                                      <a
                                        href={`mailto:${l.email}`}
                                        className="text-sm font-medium text-primary hover:underline"
                                      >
                                        {l.email}
                                      </a>
                                    </div>
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        WhatsApp
                                      </span>
                                      {l.telefone ? (
                                        <a
                                          href={`https://wa.me/55${l.telefone.replace(/\D/g, '')}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-sm font-medium text-primary hover:underline"
                                        >
                                          {l.telefone}
                                        </a>
                                      ) : (
                                        <span className="text-sm font-medium">-</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                        </SheetContent>
                      </Sheet>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Parceiro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
                              solicitação de parceria.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(l.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
