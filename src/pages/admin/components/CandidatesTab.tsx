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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Search, Filter, Eye, Download } from 'lucide-react'
import { toast } from 'sonner'

const ResumeView = ({ c }: { c: any }) => {
  const p = c.resume_data?.personal || {}
  const info = c.resume_data?.additional_info || {}
  return (
    <div className="bg-slate-200 min-h-full py-8 sm:px-8">
      <div className="font-sans text-[12pt] leading-[1.5] text-black text-justify pt-[30mm] pl-[30mm] pr-[20mm] pb-[20mm] bg-white min-h-[297mm] max-w-[210mm] mx-auto shadow-xl">
        <h1 className="text-center font-bold text-lg mb-2">
          {p.nome?.toUpperCase() || c.name.toUpperCase()}
        </h1>
        <p className="text-center mb-6 text-sm">
          {p.email || c.email} | {p.telefone || ''} | {p.endereco || ''}
        </p>

        <h2 className="font-bold mt-6 mb-2 uppercase text-base border-b border-black">
          Resumo Profissional
        </h2>
        <p>{info.resumo_profissional || 'Não informado'}</p>

        <h2 className="font-bold mt-6 mb-2 uppercase text-base border-b border-black">
          Habilidades e Idiomas
        </h2>
        <div>
          <p>
            <strong>Soft Skills:</strong> {info.soft_skills || 'Não informado'}
          </p>
          <p>
            <strong>Hard Skills:</strong> {info.hard_skills || 'Não informado'}
          </p>
          <p>
            <strong>Idiomas:</strong> {info.idiomas || 'Não informado'}
          </p>
          <p>
            <strong>Cursos Adicionais:</strong> {info.cursos_adicionais || 'Não informado'}
          </p>
        </div>

        <h2 className="font-bold mt-6 mb-2 uppercase text-base border-b border-black">
          Experiência Profissional
        </h2>
        {c.resume_data?.experiences?.length ? (
          c.resume_data.experiences.map((e: any, i: number) => (
            <div key={i} className="mb-4">
              <p>
                <strong>{e.cargo}</strong> - {e.empresa} ({e.data_inicio} a {e.data_fim || 'Atual'})
              </p>
              <p>{e.descricao}</p>
            </div>
          ))
        ) : (
          <p>Não informado</p>
        )}

        <h2 className="font-bold mt-6 mb-2 uppercase text-base border-b border-black">
          Formação Acadêmica
        </h2>
        {c.resume_data?.educations?.length ? (
          c.resume_data.educations.map((e: any, i: number) => (
            <p key={i} className="mb-2">
              <strong>{e.curso}</strong> - {e.instituicao} ({e.data_inicio} a{' '}
              {e.data_fim || 'Atual'})
            </p>
          ))
        ) : (
          <p>Não informado</p>
        )}

        <h2 className="font-bold mt-6 mb-2 uppercase text-base border-b border-black">
          Perfil Comportamental (DISC)
        </h2>
        <p>
          <strong>Resultado:</strong> {c.disc_result?.type || 'Não realizado'}
        </p>
      </div>
    </div>
  )
}

export default function CandidatesTab() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setCandidates(data || []))
  }, [])

  const filtered = candidates.filter(
    (c) =>
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())) &&
      (filter ? c.status === filter : true),
  )

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Profissão', 'Status', 'DISC']
    const csvData = filtered.map(
      (c) =>
        `"${c.name}","${c.email}","${c.profession || ''}","${c.status}","${c.disc_result?.type || ''}"`,
    )
    const csvContent = [headers.join(','), ...csvData].join('\n')
    const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `talentos_${format(new Date(), 'yyyyMMdd')}.csv`
    link.click()
    toast.success('Exportação concluída!')
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row gap-4 bg-muted/10 items-center justify-between">
        <div className="flex gap-4 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar candidato..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <div className="relative w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 pl-9 py-2 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="Novo">Novo</option>
              <option value="Entrevistado">Entrevistado</option>
              <option value="Contratado">Contratado</option>
              <option value="Rejeitado">Rejeitado</option>
            </select>
          </div>
        </div>
        <Button variant="outline" onClick={exportToCSV} disabled={filtered.length === 0}>
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Candidato</TableHead>
              <TableHead>Profissão</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.email}</div>
                </TableCell>
                <TableCell>
                  <span className="text-xs">{c.profession || 'Não informado'}</span>
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(c.created_at), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full border bg-secondary/10">
                    {c.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" /> Ver Currículo
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-3xl p-0 overflow-hidden bg-slate-200">
                      <ScrollArea className="h-full">
                        <ResumeView c={c} />
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
