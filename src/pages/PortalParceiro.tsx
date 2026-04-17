import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Loader2,
  CheckCircle2,
  MessageCircle,
  Handshake,
  Gift,
  Percent,
  Headphones,
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
import { Textarea } from '@/components/ui/textarea'
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
  nome_empresa: z.string().min(2, 'Nome da Empresa é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(14, 'Telefone incompleto'),
  profissao_ocupacao: z.string().min(2, 'Selecione sua profissão/ocupação'),
  mensagem: z.string().optional(),
  lgpd: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos de privacidade'),
})

export default function PortalParceiro() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_empresa: '',
      email: '',
      telefone: '',
      profissao_ocupacao: '',
      mensagem: '',
      lgpd: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await pb.collection('leads_parceiros').create({
        nome_empresa: values.nome_empresa,
        email: values.email,
        telefone: values.telefone,
        profissao_ocupacao: values.profissao_ocupacao,
        mensagem: values.mensagem,
      })
      setIsSuccess(true)
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: err.message || 'Ocorreu um erro ao enviar solicitação.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppHero = () => {
    trackAndOpenWhatsApp(
      WHATSAPP_COMERCIAL,
      'Olá, gostaria de saber mais sobre como me tornar um parceiro da Era Digital',
      'parceiro_hero',
    )
  }

  const benefits = [
    {
      title: 'Certificado PF Grátis',
      desc: 'Como parceiro ativo, você ganha seu certificado digital Pessoa Física gratuitamente.',
      icon: Gift,
    },
    {
      title: 'PJ a Preço de Custo',
      desc: 'Condições exclusivas e margens diferenciadas para certificados de Pessoa Jurídica.',
      icon: Percent,
    },
    {
      title: 'Suporte Dedicado',
      desc: 'Atendimento humanizado e prioritário para você e seus clientes.',
      icon: Headphones,
    },
  ]

  return (
    <div className="space-y-16 pb-10 animate-fade-in">
      <HeroSection
        title="Portal do Parceiro"
        subtitle="Junte-se à Era Digital! Contadores e escritórios de contabilidade contam com benefícios exclusivos, como e-CPF grátis e e-CNPJ a preço de custo."
        cta="Fale com um Consultor"
        onCTA={handleWhatsAppHero}
        ctaIcon={<Handshake className="h-5 w-5" />}
        ctaClassName="bg-primary hover:bg-primary/90 text-primary-foreground"
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <section>
          {isSuccess ? (
            <div className="text-center space-y-6 p-8 bg-slate-50 rounded-xl border">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
              <h2 className="text-2xl font-bold">Solicitação Recebida!</h2>
              <p className="text-muted-foreground">
                Nossa equipe de parcerias entrará em contato em breve para apresentar todas as
                vantagens.
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline">
                Voltar
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Seja nosso Parceiro</CardTitle>
                <CardDescription>
                  Preencha os dados abaixo e descubra como podemos crescer juntos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nome_empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome da Empresa ou Profissional{' '}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Sua empresa" {...field} />
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
                              E-mail <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="contato@exemplo.com" {...field} />
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
                      name="profissao_ocupacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Profissão/Ocupação <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="" disabled>
                                Selecione uma opção
                              </option>
                              <option value="Contador">Contador</option>
                              <option value="Escritório de Contabilidade">
                                Escritório de Contabilidade
                              </option>
                              <option value="Advogado">Advogado</option>
                              <option value="Outro">Outro</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mensagem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem (Opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Gostaria de saber mais sobre as comissões..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                              Permito que a Era Digital utilize meus dados para apresentar propostas
                              de parceria.
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
                      Quero ser Parceiro
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-6">
          <FAQAccordion
            category="Dúvidas Frequentes - Parceiros"
            items={[
              {
                question: 'Quem pode ser parceiro da Era Digital?',
                answer:
                  'Contadores, escritórios de contabilidade, advogados, consultores e outros profissionais que lidam com clientes que necessitam de emissão ou renovação de Certificados Digitais.',
              },
              {
                question: 'Como funciona o e-CPF grátis?',
                answer:
                  'Ao se tornar um parceiro ativo e realizar indicações mensais, seu escritório tem direito a emissões ou renovações gratuitas de e-CPF A1 para os sócios.',
              },
              {
                question: 'Qual o custo para me tornar parceiro?',
                answer:
                  'Nenhum! A parceria com a Era Digital é totalmente gratuita. Nosso objetivo é somar forças para entregar o melhor serviço ao seu cliente.',
              },
              {
                question: 'A comissão é paga em dinheiro?',
                answer:
                  'Oferecemos um modelo altamente flexível, onde você pode optar por repassar o desconto (preço de custo) direto ao seu cliente ou manter margem financeira na revenda. Nossos consultores explicarão todos os detalhes.',
              },
            ]}
          />
        </section>
      </div>
    </div>
  )
}
