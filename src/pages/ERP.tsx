import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Loader2,
  CheckCircle2,
  MessageCircle,
  BarChart4,
  Cpu,
  Layers,
  Lock,
  TrendingUp,
  Users,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPhone } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const formSchema = z.object({
  empresa: z.string().min(2, 'Nome da empresa é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(14, 'Telefone incompleto'),
  lgpd: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos de privacidade'),
})

export default function ERP() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { empresa: '', email: '', telefone: '', lgpd: false },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('leads_erp').insert({
        empresa: values.empresa,
        email: values.email,
        telefone: values.telefone,
        data_contato: new Date().toISOString(),
      })
      if (error) throw error
      setIsSuccess(true)
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: err.message || 'Ocorreu um erro.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappUrl =
    'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20uma%20an%C3%A1lise%20para%20o%20sistema%20ERP.'

  const benefits = [
    {
      title: 'Otimização',
      desc: 'Automatize tarefas manuais e reduza erros operacionais.',
      icon: Cpu,
    },
    {
      title: 'Redução de Custos',
      desc: 'Identifique gargalos financeiros e maximize seus lucros.',
      icon: TrendingUp,
    },
    {
      title: 'Integração',
      desc: 'Vendas, estoque e financeiro em uma única plataforma.',
      icon: Layers,
    },
    {
      title: 'Dados em Tempo Real',
      desc: 'Relatórios precisos para tomadas de decisão ágeis.',
      icon: BarChart4,
    },
    { title: 'Segurança', desc: 'Acesso controlado e backup automático em nuvem.', icon: Lock },
    { title: 'Escalabilidade', desc: 'O sistema cresce junto com a sua empresa.', icon: Users },
  ]

  return (
    <div className="space-y-16 pb-10 animate-fade-in">
      {/* Header */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Sistemas ERP</h1>
        <p className="text-lg text-muted-foreground">
          Assuma o controle total do seu negócio. Nossas soluções ERP oferecem gestão inteligente,
          integrações robustas e a flexibilidade que sua empresa precisa para crescer.
        </p>
        <div className="flex justify-center pt-4">
          <Button size="lg" className="bg-[#25D366] hover:bg-[#20bd5a] text-white" asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicitar Análise no WhatsApp
            </a>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b, i) => (
          <Card key={i} className="hover:border-secondary/50 transition-colors">
            <CardHeader className="pb-2">
              <b.icon className="h-8 w-8 text-secondary mb-2" />
              <CardTitle className="text-xl">{b.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">{b.desc}</CardContent>
          </Card>
        ))}
      </section>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Lead Form */}
        <section>
          {isSuccess ? (
            <div className="text-center space-y-6 p-8 bg-slate-50 rounded-xl border">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
              <h2 className="text-2xl font-bold">Obrigado pelo interesse!</h2>
              <p className="text-muted-foreground">
                Um consultor entrará em contato para apresentar a melhor solução.
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline">
                Voltar
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Solicite uma Demonstração</CardTitle>
                <CardDescription>
                  Deixe seus dados para que possamos apresentar como o ERP pode ajudar sua empresa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Sua Empresa LTDA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail Corporativo</FormLabel>
                            <FormControl>
                              <Input placeholder="contato@empresa.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field: { onChange, value, ...rest } }) => (
                          <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(00) 00000-0000"
                                value={value}
                                onChange={(e) => onChange(formatPhone(e.target.value))}
                                {...rest}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="lgpd"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Termos de Privacidade (LGPD)</FormLabel>
                            <FormDescription className="text-xs">
                              Permito que a Era Digital utilize meus dados para contato.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Quero conhecer o ERP
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Dúvidas Frequentes sobre ERP</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>O sistema é em nuvem ou local?</AccordionTrigger>
              <AccordionContent>
                Nosso ERP é 100% em nuvem (Cloud), permitindo que você acesse as informações da sua
                empresa de qualquer lugar, a qualquer momento e com total segurança.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Como funciona o processo de implantação?</AccordionTrigger>
              <AccordionContent>
                Realizamos um mapeamento dos seus processos, configuramos os módulos necessários,
                migramos seus dados atuais e realizamos o treinamento com sua equipe. O tempo médio
                varia de 15 a 45 dias.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Posso integrar com minha loja virtual?</AccordionTrigger>
              <AccordionContent>
                Sim! Nosso sistema possui APIs robustas que permitem integração com as principais
                plataformas de e-commerce e marketplaces do mercado.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>O suporte é cobrado à parte?</AccordionTrigger>
              <AccordionContent>
                Não. Todo o suporte técnico via chat e ticket está incluso na sua mensalidade,
                garantindo que sua operação nunca pare.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  )
}
