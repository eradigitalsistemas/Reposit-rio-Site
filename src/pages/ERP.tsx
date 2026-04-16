import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Loader2,
  CheckCircle2,
  MessageCircle,
  BarChart4,
  Layers,
  Lock,
  Users,
  Receipt,
  MonitorSmartphone,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { HeroSection } from '@/components/blocks/HeroSection'
import { FeatureCard } from '@/components/blocks/FeatureCard'
import { FAQAccordion } from '@/components/blocks/FAQAccordion'
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
import { trackAndOpenWhatsApp, WHATSAPP_COMERCIAL } from '@/lib/whatsapp'

const formSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
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
    defaultValues: { nome: '', empresa: '', email: '', telefone: '', lgpd: false },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await pb.collection('leads_erp').create({
        nome: values.nome,
        empresa: values.empresa,
        email: values.email,
        telefone: values.telefone,
        data_contato: new Date().toISOString(),
      })
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

  const handleWhatsAppHero = () => {
    trackAndOpenWhatsApp(
      WHATSAPP_COMERCIAL,
      'Olá, gostaria de solicitar uma análise de ERP para minha empresa',
      'erp_hero',
    )
  }

  const benefits = [
    {
      title: 'Emissão de Notas Fiscais',
      desc: 'Emita suas notas fiscais de forma ágil, segura e em total conformidade com a legislação.',
      icon: Receipt,
    },
    {
      title: 'Tela de Caixa',
      desc: 'Frente de caixa (PDV) intuitiva para agilizar suas vendas e o controle financeiro diário.',
      icon: MonitorSmartphone,
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
      <HeroSection
        title="Sistemas ERP"
        subtitle="Assuma o controle total do seu negócio. Nossas soluções ERP oferecem gestão inteligente, integrações robustas e a flexibilidade que sua empresa precisa para crescer."
        cta="Solicitar Análise no WhatsApp"
        onCTA={handleWhatsAppHero}
        ctaIcon={<MessageCircle className="h-5 w-5" />}
        ctaClassName="bg-[#25D366] hover:bg-[#20bd5a] text-white"
      />

      {/* Benefits */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b, i) => (
          <FeatureCard
            key={i}
            icon={<b.icon className="w-full h-full" />}
            title={b.title}
            description={b.desc}
          />
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
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Seu Nome <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: João da Silva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome da Empresa <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Sua Empresa LTDA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              E-mail Corporativo <span className="text-destructive">*</span>
                            </FormLabel>
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
                            <FormLabel>
                              WhatsApp <span className="text-destructive">*</span>
                            </FormLabel>
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
                            <FormLabel>
                              Termos de Privacidade (LGPD){' '}
                              <span className="text-destructive">*</span>
                            </FormLabel>
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
          <FAQAccordion
            category="Dúvidas Frequentes sobre ERP"
            items={[
              {
                question: 'O sistema é em nuvem ou local?',
                answer: 'Nossos sistemas funcionam tanto em nuvem, quanto em dados locais.',
              },
              {
                question: 'Como funciona o processo de implantação?',
                answer:
                  'Realizamos um mapeamento dos seus processos, configuramos os módulos necessários, migramos seus dados atuais e realizamos o treinamento com sua equipe. O tempo médio de implantação varia entre 7 a 15 dias. Mas pode ser realizado antes do prazo.',
              },
              {
                question: 'Posso integrar com minha loja virtual?',
                answer:
                  'Sim! Nosso sistema possui APIs robustas que permitem integração com as principais plataformas de e-commerce e marketplaces do mercado.',
              },
              {
                question: 'O suporte é cobrado à parte?',
                answer:
                  'Não. Todo o suporte técnico via chat e ticket está incluso na sua mensalidade, garantindo que sua operação nunca pare.',
              },
            ]}
          />
        </section>
      </div>
    </div>
  )
}
