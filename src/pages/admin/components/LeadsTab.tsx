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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Search, Eye } from 'lucide-react'

export default function LeadsTab() {
  const [leads, setLeads] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      const [erp, cert, geral] = await Promise.all([
        supabase.from('leads_erp').select('*').order('created_at', { ascending: false }),
        supabase.from('leads_certificados').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('data_criacao', { ascending: false }),
      ])
      const arr: any[] = []
      erp.data?.forEach((l) =>
        arr.push({
          id: `erp-${l.id}`,
          type: 'ERP',
          name: l.nome || l.empresa || 'Não informado',
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
    }
    load()
  }, [])

  const filtered = leads.filter(
    (l) =>
      (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex gap-4 bg-muted/10">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Nome / Empresa</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="text-sm">
                  {format(new Date(l.date), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full border bg-primary/10 text-primary">
                    {l.type}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-sm">{l.name}</TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground">{l.email}</div>
                  <div className="text-xs text-muted-foreground">{l.phone || '-'}</div>
                </TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" /> Detalhes
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>Detalhes do Lead</SheetTitle>
                      </SheetHeader>
                      <ScrollArea className="h-[calc(100vh-100px)] mt-6">
                        <div className="space-y-4">
                          <div>
                            <span className="font-semibold text-sm text-muted-foreground block">
                              Origem
                            </span>{' '}
                            {l.type}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-muted-foreground block">
                              Data de Cadastro
                            </span>{' '}
                            {format(new Date(l.date), 'dd/MM/yyyy HH:mm')}
                          </div>

                          {l.type === 'ERP' && (
                            <>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  Nome
                                </span>{' '}
                                {l.raw.nome || l.name}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  Empresa
                                </span>{' '}
                                {l.raw.empresa}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  E-mail
                                </span>{' '}
                                {l.raw.email}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  WhatsApp
                                </span>{' '}
                                {l.raw.telefone}
                              </div>
                            </>
                          )}
                          {l.type === 'Certificados' && (
                            <>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  Nome
                                </span>{' '}
                                {l.raw.nome || l.name}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  Tipo Solicitado
                                </span>{' '}
                                {l.raw.tipo_certificado}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  E-mail
                                </span>{' '}
                                {l.raw.email}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  WhatsApp
                                </span>{' '}
                                {l.raw.telefone}
                              </div>
                            </>
                          )}
                          {l.type === 'Contato Geral' && (
                            <>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  Nome
                                </span>{' '}
                                {l.raw.nome}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  Empresa
                                </span>{' '}
                                {l.raw.empresa || '-'}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  Estágio
                                </span>{' '}
                                {l.raw.estagio}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  E-mail
                                </span>{' '}
                                {l.raw.email}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  WhatsApp
                                </span>{' '}
                                {l.raw.telefone || '-'}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-muted-foreground block">
                                  Observações
                                </span>{' '}
                                <p className="whitespace-pre-wrap mt-1 p-3 bg-muted rounded-md text-sm">
                                  {l.raw.observacoes || 'Nenhuma'}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
