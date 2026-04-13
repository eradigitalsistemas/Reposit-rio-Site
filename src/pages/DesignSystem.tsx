import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { MultiSelect } from '@/components/ui/multi-select'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Home } from 'lucide-react'
import { Modal } from '@/components/ui/modal'

export default function DesignSystem() {
  const { toast } = useToast()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="container py-12 space-y-16">
      <div>
        <h1 className="h1 mb-2 text-primary">Design System</h1>
        <p className="body-text text-muted-foreground">
          Identidade visual consistente, acessível (WCAG AA) e moderna para a Era Digital.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">1. Cores da Marca</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="h-20 w-full rounded-md shadow-low bg-primary"></div>
            <p className="font-semibold text-sm">Primária (Azul)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-md shadow-low bg-secondary"></div>
            <p className="font-semibold text-sm">Secundária (Verde/Teal)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-md shadow-low bg-accent"></div>
            <p className="font-semibold text-sm">Destaque (Laranja)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-md shadow-low bg-destructive"></div>
            <p className="font-semibold text-sm">Erro (Vermelho)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-md shadow-low bg-muted border border-border"></div>
            <p className="font-semibold text-sm">Neutra (Cinza)</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">2. Tipografia</h2>
        <div className="space-y-4">
          <div>
            <h1 className="h1">Título H1 (32px, Bold)</h1>
            <p className="text-small text-muted-foreground">
              Usado para títulos principais de páginas.
            </p>
          </div>
          <div>
            <h2 className="h2">Título H2 (24px, Semibold)</h2>
            <p className="text-small text-muted-foreground">Usado para seções principais.</p>
          </div>
          <div>
            <h3 className="h3">Título H3 (20px, Semibold)</h3>
            <p className="text-small text-muted-foreground">Usado para subseções e cards.</p>
          </div>
          <div>
            <p className="body-text">Texto de Corpo (16px, Regular)</p>
            <p className="text-small text-muted-foreground">
              Usado para parágrafos, descrições e conteúdo geral. O line-height de 1.5 melhora a
              legibilidade.
            </p>
          </div>
          <div>
            <small className="text-small">Texto Pequeno (14px, Regular)</small>
            <p className="text-small text-muted-foreground mt-1">
              Usado para legendas, metadados e badges.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">3. Botões</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="space-y-6 max-w-md">
        <h2 className="h2 border-b pb-2">4. Inputs</h2>
        <div className="space-y-4">
          <Input type="text" label="Padrão" placeholder="Input padrão com sombra baixa" />
          <Input type="email" label="Email" error="Email inválido" placeholder="Input com erro" />
          <Input type="text" label="Sucesso" success placeholder="Input validado" />
          <Input type="tel" label="Telefone" disabled placeholder="Input desabilitado" />
          <Input type="text" label="Obrigatório" required placeholder="Campo obrigatório" />
        </div>
      </section>

      <section className="space-y-6 max-w-sm">
        <h2 className="h2 border-b pb-2">5. Selects & Dropdowns</h2>
        <div className="space-y-4">
          <Select
            placeholder="Selecione uma opção..."
            options={[
              { label: 'Opção 1', value: '1' },
              { label: 'Opção 2', value: '2' },
            ]}
          />

          <MultiSelect
            options={[
              { label: 'React', value: 'react' },
              { label: 'Vue', value: 'vue' },
              { label: 'Angular', value: 'angular' },
            ]}
            selected={selectedItems}
            onChange={setSelectedItems}
            placeholder="Múltipla seleção..."
            searchable
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">6. Cards</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            title="Título do Card"
            subtitle="Descrição auxiliar do card"
            hoverable
            footer={
              <div className="flex w-full justify-between">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar</Button>
              </div>
            }
          >
            <p className="body-text">
              Conteúdo principal do card utilizando props de atalho. Elevação "low" no estado normal
              e "medium" no hover.
            </p>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">7. Modals / Dialogs</h2>
        <Button variant="outline" onClick={() => setIsModalOpen(true)}>
          Abrir Modal
        </Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirmar exclusão"
          actions={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => setIsModalOpen(false)}>
                Excluir
              </Button>
            </div>
          }
        >
          <p className="body-text text-muted-foreground">
            Esta ação não pode ser desfeita. Isso excluirá permanentemente os dados da sua conta.
          </p>
        </Modal>
      </section>

      <section className="space-y-6 max-w-md">
        <h2 className="h2 border-b pb-2">8. Accordion</h2>
        <Accordion
          items={[
            {
              title: 'Como funciona o sistema?',
              content: 'O sistema permite capturar e organizar leads de forma eficiente.',
            },
            {
              title: 'Posso integrar com outros apps?',
              content: 'Sim, possuímos integrações via Edge Functions e Webhooks.',
            },
          ]}
        />
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">9. Badges</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge>Default (Soft)</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="error">Error</Badge>
          <Badge size="md" variant="primary">
            Medium Size
          </Badge>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">10. Spinners</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">11. Breadcrumbs</h2>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Componentes', href: '/design-system' },
          ]}
          current="Design System"
        />
      </section>

      <section className="space-y-6">
        <h2 className="h2 border-b pb-2">12. Toasts</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: 'Padrão', description: 'Notificação padrão do sistema.' })
            }
          >
            Default
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                variant: 'success',
                title: 'Sucesso!',
                description: 'Operação realizada com sucesso.',
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Ocorreu um erro na operação.',
              })
            }
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({ variant: 'warning', title: 'Aviso', description: 'Atenção com esta ação.' })
            }
          >
            Warning
          </Button>
        </div>
      </section>
    </div>
  )
}
