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

export default function DesignSystem() {
  const { toast } = useToast()
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  return (
    <div className="container py-10 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Design System</h1>
        <p className="text-muted-foreground">Componentes base da Super Era Digital</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">1. Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="space-y-4 max-w-sm">
        <h2 className="text-2xl font-semibold border-b pb-2">2. Inputs</h2>
        <div className="space-y-4">
          <Input placeholder="Input padrão" />
          <Input error placeholder="Input com erro" />
          <Input disabled placeholder="Input desabilitado" />
        </div>
      </section>

      <section className="space-y-4 max-w-sm">
        <h2 className="text-2xl font-semibold border-b pb-2">3. Selects & Dropdowns</h2>
        <div className="space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select padrão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Opção 1</SelectItem>
              <SelectItem value="2">Opção 2</SelectItem>
            </SelectContent>
          </Select>

          <MultiSelect
            options={[
              { label: 'React', value: 'react' },
              { label: 'Vue', value: 'vue' },
              { label: 'Angular', value: 'angular' },
            ]}
            selected={selectedItems}
            onChange={setSelectedItems}
            placeholder="Múltipla seleção..."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">4. Cards</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Título do Card</CardTitle>
            <CardDescription>Descrição auxiliar do card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Conteúdo principal do card com padding e formatação adequada.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancelar</Button>
            <Button>Salvar</Button>
          </CardFooter>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">5. Modals / Dialogs</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Abrir Modal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Você tem certeza?</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente os dados.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button variant="destructive">Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">6. Toasts</h2>
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
            className="border-green-500 text-green-600 hover:bg-green-50"
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
            className="border-red-500 text-red-600 hover:bg-red-50"
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
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
            onClick={() =>
              toast({ variant: 'info', title: 'Info', description: 'Apenas uma informação.' })
            }
          >
            Info
          </Button>
        </div>
      </section>

      <section className="space-y-4 max-w-md">
        <h2 className="text-2xl font-semibold border-b pb-2">7. Accordion</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Como funciona o sistema?</AccordionTrigger>
            <AccordionContent>
              O sistema permite capturar e organizar leads de forma eficiente.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Posso integrar com outros apps?</AccordionTrigger>
            <AccordionContent>
              Sim, possuímos integrações via Edge Functions e Webhooks.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">8. Badges</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">9. Spinners</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">10. Breadcrumbs</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/design-system">Componentes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Design System</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>
    </div>
  )
}
