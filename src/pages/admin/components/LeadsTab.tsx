import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
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
import { format } from 'date-fns'
import { Search, Eye, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function LeadsTab() {
  const [leads, setLeads] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const loadAll = async () => {
    try {
      const [leadsRes, parceirosRes] = await Promise.all([
        pb.collection('leads').getFullList({ sort: '-created' }),
        pb.collection('leads_parceiros').getFullList({ sort: '-created' }),
      ])

      const combined = [
        ...leadsRes.map((l: any) => ({ ...l, _collection: 'leads' })),
        ...parceirosRes.map((p: any) => ({
          ...p,
          _collection: 'leads_parceiros',
          tipo: 'Parceria',
          nome: p.nome_empresa,
        })),
      ].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())

      setLeads(combined)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  useRealtime('leads', () => loadAll())
  useRealtime('leads_parceiros', () => loadAll())

  const formatDate = (dateString: string) =>
    dateString ? format(new Date(dateString), 'dd/MM/yyyy HH:mm') : '-'

  const detailRow = (label: string, value: any) => (
    <div className="mb-4 bg-muted/20 p-3 rounded border">
      <span className="block text-xs text-muted-foreground mb-1">{label}</span>
      <span className="text-sm font-medium">{value || '-'}</span>
    </div>
  )

  const filtered = leads.filter((i: any) =>
    Object.values(i).some((val) => String(val).toLowerCase().includes(search.toLowerCase())),
  )

  const handleDelete = async (l: any) => {
    try {
      await pb.collection(l._collection).delete(l.id)
      toast.success('Lead excluído com sucesso!')
    } catch (err) {
      toast.error('Erro ao excluir lead.')
    }
  }

  const renderDetails = (l: any) => (
    <ScrollArea className="h-[calc(100vh-100px)] pr-4">
      {detailRow('Data', formatDate(l.created))}
      {detailRow('Tipo', l.tipo || 'Geral')}
      {detailRow('Nome', l.nome)}
      {detailRow('Email', l.email)}
      {detailRow('Telefone', l.telefone)}
      {l.empresa && detailRow('Empresa', l.empresa)}
      {l.certificate_interest && detailRow('Tipo de Certificado', l.certificate_interest)}
      {l._collection === 'leads_parceiros' &&
        l.profissao_ocupacao &&
        detailRow('Profissão/Ocupação', l.profissao_ocupacao)}
      {l.mensagem && detailRow('Mensagem', l.mensagem)}
      {l.estagio && detailRow('Estágio', l.estagio)}
      {l.status_interesse && detailRow('Status', l.status_interesse)}
    </ScrollArea>
  )

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-muted/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-lg font-semibold">Todos os Leads</h2>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Nenhum lead encontrado.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((l: any) => (
              <TableRow key={l.id}>
                <TableCell className="text-muted-foreground">{formatDate(l.created)}</TableCell>
                <TableCell className="font-medium">{l.nome}</TableCell>
                <TableCell>{l.email}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    {l.tipo || 'Geral'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" /> Ver
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-md">
                        <SheetHeader className="mb-6">
                          <SheetTitle>Detalhes do Lead</SheetTitle>
                        </SheetHeader>
                        {renderDetails(l)}
                      </SheetContent>
                    </Sheet>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            O lead será permanentemente excluído do sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(l)}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
