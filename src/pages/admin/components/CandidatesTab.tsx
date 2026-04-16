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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Search, Eye, Trash2 } from 'lucide-react'
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

const ResumeView = ({ c }: { c: any }) => {
  const formacoes = Array.isArray(c.formacoes) ? c.formacoes : []
  const experiencias = Array.isArray(c.experiencias) ? c.experiencias : []
  const disc = c.disc_resultado || {}

  return (
    <div className="space-y-6 p-6 bg-background rounded-lg">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">{c.nome}</h2>
        <div className="text-muted-foreground space-y-1 mt-2 text-sm">
          <p>
            <strong>E-mail:</strong> {c.email}
          </p>
          <p>
            <strong>Telefone:</strong> {c.telefone}
          </p>
          <p>
            <strong>Nascimento:</strong>{' '}
            {c.data_nascimento
              ? format(new Date(c.data_nascimento), 'dd/MM/yyyy')
              : 'Não informado'}
          </p>
          <p>
            <strong>Endereço:</strong> {c.endereco || 'Não informado'}
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <span className="text-xs px-2 py-1 bg-secondary rounded-md">
            Origem: {c.origem || 'N/A'}
          </span>
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">
            Status: {c.status || 'Novo'}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg border-b mb-3">Experiência Profissional</h3>
        {experiencias.length > 0 ? (
          experiencias.map((e: any, i: number) => (
            <div key={i} className="mb-4">
              <p className="font-medium text-base">
                {e.cargo} na {e.empresa}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                {e.data_inicio} - {e.data_fim || 'Atual'}
              </p>
              <p className="text-sm">{e.descricao}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Não informada</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-lg border-b mb-3">Formação Acadêmica</h3>
        {formacoes.length > 0 ? (
          formacoes.map((f: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="font-medium text-base">
                {f.curso} - {f.instituicao}
              </p>
              <p className="text-sm text-muted-foreground">
                {f.data_inicio} - {f.data_fim || 'Atual'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Não informada</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-lg border-b mb-3">Perfil DISC</h3>
        <p className="text-sm mb-2">
          Respondido: <strong>{c.disc_respondido ? 'Sim' : 'Não'}</strong>
        </p>
        {c.disc_respondido && disc.tipo_perfil && (
          <div className="bg-muted/30 p-4 rounded-md text-sm space-y-2">
            <p className="font-medium text-base text-primary mb-2">Resultado: {disc.tipo_perfil}</p>
            <div className="grid grid-cols-2 gap-2 max-w-sm">
              <div className="flex justify-between">
                <span>Dominância (D):</span>{' '}
                <span className="font-bold">{disc.pontuacao_d || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Influência (I):</span>{' '}
                <span className="font-bold">{disc.pontuacao_i || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Estabilidade (S):</span>{' '}
                <span className="font-bold">{disc.pontuacao_s || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Conformidade (C):</span>{' '}
                <span className="font-bold">{disc.pontuacao_c || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {c.curriculo_url && (
        <div className="pt-4">
          <Button asChild variant="outline" className="w-full">
            <a href={c.curriculo_url} target="_blank" rel="noopener noreferrer">
              Acessar Currículo Original (Link)
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}

export default function CandidatesTab() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const loadData = async () => {
    try {
      const records = await pb.collection('candidatos').getFullList({ sort: '-created' })
      setCandidates(records)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('candidatos', () => {
    loadData()
  })

  const filtered = candidates.filter(
    (c) =>
      (c.nome || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    try {
      await pb.collection('candidatos').delete(id)
      toast.success('Candidato excluído com sucesso!')
    } catch (err) {
      toast.error('Erro ao excluir candidato.')
    }
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-muted/10 flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar candidato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status / Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.nome}</TableCell>
              <TableCell>
                <div className="text-sm">{c.email}</div>
                <div className="text-xs text-muted-foreground">{c.telefone}</div>
              </TableCell>
              <TableCell>
                <div className="text-xs font-medium">{c.status || 'Novo'}</div>
                <div className="text-xs text-muted-foreground">
                  {c.created ? format(new Date(c.created), 'dd/MM/yyyy') : '-'}
                </div>
              </TableCell>
              <TableCell className="text-right flex items-center justify-end gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" /> Ver
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-2xl bg-muted/30 p-0">
                    <ScrollArea className="h-full p-4">
                      <ResumeView c={c} />
                    </ScrollArea>
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
                        Esta ação é irreversível. O candidato será removido da base.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(c.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
