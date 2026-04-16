import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

const GenericLeadTable = ({ items, search, collectionName, columns, renderDetails }: any) => {
  const filtered = items.filter((i: any) =>
    Object.values(i).some((val) => String(val).toLowerCase().includes(search.toLowerCase())),
  )

  const handleDelete = async (id: string) => {
    try {
      await pb.collection(collectionName).delete(id)
      toast.success('Lead excluído com sucesso!')
    } catch (err) {
      toast.error('Erro ao excluir lead.')
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((c: any, idx: number) => (
            <TableHead key={idx}>{c.label}</TableHead>
          ))}
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((l: any) => (
          <TableRow key={l.id}>
            {columns.map((c: any, idx: number) => (
              <TableCell key={idx}>{c.render(l)}</TableCell>
            ))}
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
  )
}

export default function LeadsTab() {
  const [leadsGeral, setLeadsGeral] = useState<any[]>([])
  const [leadsErp, setLeadsErp] = useState<any[]>([])
  const [leadsCert, setLeadsCert] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const loadAll = async () => {
    pb.collection('leads')
      .getFullList({ sort: '-created' })
      .then(setLeadsGeral)
      .catch(console.error)
    pb.collection('leads_erp')
      .getFullList({ sort: '-created' })
      .then(setLeadsErp)
      .catch(console.error)
    pb.collection('leads_certificados')
      .getFullList({ sort: '-created' })
      .then(setLeadsCert)
      .catch(console.error)
  }

  useEffect(() => {
    loadAll()
  }, [])
  useRealtime('leads', () => loadAll())
  useRealtime('leads_erp', () => loadAll())
  useRealtime('leads_certificados', () => loadAll())

  const formatDate = (dateString: string) =>
    dateString ? format(new Date(dateString), 'dd/MM/yyyy HH:mm') : '-'

  const detailRow = (label: string, value: any) => (
    <div className="mb-4 bg-muted/20 p-3 rounded border">
      <span className="block text-xs text-muted-foreground mb-1">{label}</span>
      <span className="text-sm font-medium">{value || '-'}</span>
    </div>
  )

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <Tabs defaultValue="geral" className="w-full">
        <div className="p-4 border-b bg-muted/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <TabsList>
            <TabsTrigger value="geral">Geral / Parceiros</TabsTrigger>
            <TabsTrigger value="erp">ERP</TabsTrigger>
            <TabsTrigger value="certificados">Certificados</TabsTrigger>
          </TabsList>
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

        <TabsContent value="geral" className="m-0">
          <GenericLeadTable
            items={leadsGeral}
            search={search}
            collectionName="leads"
            columns={[
              { label: 'Data', render: (l: any) => formatDate(l.created) },
              { label: 'Nome', render: (l: any) => l.nome },
              { label: 'Email', render: (l: any) => l.email },
              { label: 'Estágio', render: (l: any) => l.estagio || '-' },
            ]}
            renderDetails={(l: any) => (
              <div>
                {detailRow('Data', formatDate(l.created))}
                {detailRow('Nome', l.nome)}
                {detailRow('Email', l.email)}
                {detailRow('Telefone', l.telefone)}
                {detailRow('Interesse', l.certificate_interest)}
                {detailRow('Estágio', l.estagio)}
                {detailRow('Status', l.status_interesse)}
              </div>
            )}
          />
        </TabsContent>

        <TabsContent value="erp" className="m-0">
          <GenericLeadTable
            items={leadsErp}
            search={search}
            collectionName="leads_erp"
            columns={[
              {
                label: 'Data Contato',
                render: (l: any) => formatDate(l.data_contato || l.created),
              },
              { label: 'Empresa', render: (l: any) => l.empresa },
              { label: 'Email', render: (l: any) => l.email },
            ]}
            renderDetails={(l: any) => (
              <div>
                {detailRow('Data Contato', formatDate(l.data_contato || l.created))}
                {detailRow('Empresa', l.empresa)}
                {detailRow('Email', l.email)}
                {detailRow('Telefone', l.telefone)}
              </div>
            )}
          />
        </TabsContent>

        <TabsContent value="certificados" className="m-0">
          <GenericLeadTable
            items={leadsCert}
            search={search}
            collectionName="leads_certificados"
            columns={[
              {
                label: 'Data Contato',
                render: (l: any) => formatDate(l.data_contato || l.created),
              },
              { label: 'Email', render: (l: any) => l.email },
              { label: 'Tipo Certificado', render: (l: any) => l.tipo_certificado },
            ]}
            renderDetails={(l: any) => (
              <div>
                {detailRow('Data Contato', formatDate(l.data_contato || l.created))}
                {detailRow('Email', l.email)}
                {detailRow('Telefone', l.telefone)}
                {detailRow('Tipo Certificado', l.tipo_certificado)}
              </div>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
