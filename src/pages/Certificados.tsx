import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, CheckCircle2, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { HeroSection } from '@/components/blocks/HeroSection'
import { CertificateCard } from '@/components/blocks/CertificateCard'
import { FAQAccordion } from '@/components/blocks/FAQAccordion'
import { formatPhone } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { trackAndOpenWhatsApp, WHATSAPP_SUPORTE } from '@/lib/whatsapp'

const formSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  tipo_certificado: z.string().min(1, 'Selecione o tipo de certificado'),
  telefone: z.string().min(14, 'Telefone incompleto'),
  lgpd: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos de privacidade'),
})

export default function Certificados() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', email: '', tipo_certificado: '', telefone: '', lgpd: false },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('leads_certificados').insert({
        nome: values.nome,
        email: values.email,
        tipo_certificado: values.tipo_certificado,
        telefone: values.telefone,
        data_contato: new Date().toISOString(),
      } as any)
      if (error) throw error
      setIsSuccess(true)
      toast({
        title: 'Sucesso!',
        description: 'Sua solicitação foi recebida. Entraremos em contato.',
      })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: err.message || 'Ocorreu um erro inesperado.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppHero = () => {
    trackAndOpenWhatsApp(
      WHATSAPP_SUPORTE,
      'Olá, gostaria de saber mais sobre os Certificados Digitais',
      'certificados_hero',
    )
  }

  const [certificates, setCertificates] = useState<
    Database['public']['Tables']['certificates']['Row'][]
  >([])
  const [isLoadingCerts, setIsLoadingCerts] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    async function fetchCertificates() {
      try {
        setFetchError(false)
        const { data, error } = await supabase.from('certificates').select('*').order('id')
        if (error) throw error
        setCertificates(data || [])
      } catch (err) {
        console.error('Error fetching certificates:', err)
        setFetchError(true)
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar certificados',
          description:
            'Não foi possível carregar as opções do banco de dados. Tente novamente mais tarde.',
        })
      } finally {
        setIsLoadingCerts(false)
      }
    }
    fetchCertificates()
  }, [toast])

  const handleWhatsAppCard = (title: string) => {
    trackAndOpenWhatsApp(
      WHATSAPP_SUPORTE,
      `Olá, gostaria de saber mais sobre ${title}`,
      'certificados_card',
    )
  }

  return (
    <div className="space-y-16 pb-10 animate-fade-in">
      {/* Header */}
      <HeroSection
        title="Certificados Digitais"
        subtitle="Segurança, validade jurídica e agilidade para suas transações online. Escolha o certificado ideal para você ou sua empresa."
        cta="Solicitar via WhatsApp"
        onCTA={handleWhatsAppHero}
        ctaIcon={<MessageCircle className="h-5 w-5" />}
        ctaClassName="bg-[#25D366] hover:bg-[#20bd5a] text-white"
      />

      {/* Types of Certificates */}
      <section className="min-h-[200px]">
        {isLoadingCerts ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : fetchError ? (
          <div className="text-center text-destructive h-48 flex flex-col items-center justify-center bg-red-50 rounded-xl border border-dashed border-red-200 p-4">
            <p className="font-medium mb-4">Não foi possível carregar os certificados.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center text-muted-foreground h-48 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed">
            Nenhum certificado encontrado no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                type={cert.title}
                description={cert.description}
                benefits={cert.benefits as string[]}
                onAction={() => handleWhatsAppCard(cert.title)}
              />
            ))}
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* FAQ Section */}
        <section className="space-y-6">
          <FAQAccordion
            category="Dúvidas Frequentes"
            items={[
              {
                question: 'O que é um Certificado Digital?',
                answer:
                  'É a identidade eletrônica de uma pessoa ou empresa. Ele funciona como uma carteira de identidade virtual que permite assinar documentos com validade jurídica.',
              },
              {
                question: 'Qual a diferença entre A1 e A3?',
                answer:
                  'O certificado A1 é emitido e armazenado no computador (software) com validade de 1 ano. O A3 é armazenado em mídia criptográfica (Token ou Cartão Inteligente) com validade de até 3 anos.',
              },
              {
                question: 'Preciso ir presencialmente para emitir?',
                answer:
                  'Em muitos casos, se você já possui biometria cadastrada no sistema ou CNH digital, a emissão pode ser feita 100% por videoconferência.',
              },
            ]}
          />
        </section>

        {/* Lead Form */}
        <section>
          {isSuccess ? (
            <div className="text-center space-y-6 p-8 bg-slate-50 rounded-xl border">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
              <h2 className="text-2xl font-bold">Tudo Certo!</h2>
              <p className="text-muted-foreground">
                Sua solicitação foi registrada. Entraremos em contato em breve.
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline">
                Enviar nova solicitação
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Solicite seu Certificado</CardTitle>
                <CardDescription>
                  Preencha os dados abaixo e nossa equipe cuidará de tudo para você.
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
                            Nome <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            E-mail <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" {...field} />
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
                            Telefone / WhatsApp <span className="text-destructive">*</span>
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
                    <FormField
                      control={form.control}
                      name="tipo_certificado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tipo de Certificado <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="e-cpf">e-CPF</SelectItem>
                              <SelectItem value="e-cnpj">e-CNPJ</SelectItem>
                              <SelectItem value="nf-e">NF-e</SelectItem>
                            </SelectContent>
                          </Select>
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
                              Concordo com o processamento dos meus dados para contato.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enviar Solicitação
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
