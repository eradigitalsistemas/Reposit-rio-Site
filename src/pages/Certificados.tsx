import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link } from 'react-router-dom'
import {
  Loader2,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  Database as DatabaseIcon,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { HeroSection } from '@/components/blocks/HeroSection'
import { CertificateCard } from '@/components/blocks/CertificateCard'
import { FAQAccordion } from '@/components/blocks/FAQAccordion'
import { formatPhone } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { trackAndOpenWhatsApp, WHATSAPP_SUPORTE } from '@/lib/whatsapp'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'

const formSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  empresa: z.string().optional().or(z.literal('')),
  email: z.string().min(1, 'E-mail é obrigatório').email('Email inválido'),
  tipo_certificado: z.string().min(1, 'Selecione o tipo de certificado'),
  telefone: z.string().optional().or(z.literal('')),
  lgpd: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos de privacidade'),
})

const cleanText = (text: any) => {
  if (!text) return ''
  return String(text)
    .replace(/[[\]"]/g, '')
    .trim()
}

export default function Certificados() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      empresa: '',
      email: '',
      tipo_certificado: '',
      telefone: '',
      lgpd: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await pb.collection('leads_certificados').create({
        nome: values.nome,
        empresa: values.empresa,
        email: values.email,
        telefone: values.telefone,
        tipo_certificado: values.tipo_certificado,
        data_contato: new Date().toISOString(),
      })

      setIsSuccess(true)
      toast({
        title: 'Sucesso!',
        description: 'Cadastro realizado com sucesso!',
      })
      form.reset()
    } catch (err: any) {
      const fieldErrors = extractFieldErrors(err)

      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          form.setError(field as any, { type: 'server', message: msg })
        })
      }

      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description:
          getErrorMessage(err) ||
          'Não foi possível enviar sua solicitação. Verifique os dados e tente novamente.',
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

  const [certificates, setCertificates] = useState<any[]>([])
  const [isLoadingCerts, setIsLoadingCerts] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  async function fetchCertificates(isInitial = false) {
    if (isInitial) setIsLoadingCerts(true)
    try {
      setFetchError(false)
      const data = await pb.collection('certificados').getFullList({ sort: 'created' })
      setCertificates(data || [])
    } catch (err: any) {
      console.error('Error fetching certificates:', err)
      if (isInitial) setFetchError(true)
    } finally {
      if (isInitial) setIsLoadingCerts(false)
    }
  }

  useEffect(() => {
    fetchCertificates(true)
  }, [])

  useRealtime('certificados', () => {
    fetchCertificates(false)
  })

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="flex flex-col h-full overflow-hidden border">
                <CardHeader className="bg-slate-50 border-b pb-4">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5 mt-1" />
                </CardHeader>
                <CardContent className="flex-1 pt-6 flex flex-col">
                  <div className="space-y-3 mb-6 flex-1">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-start gap-2">
                        <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : fetchError ? (
          <div className="flex justify-center p-4">
            <Alert variant="destructive" className="max-w-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar</AlertTitle>
              <AlertDescription className="mt-2 flex flex-col gap-4">
                <p>
                  Não foi possível carregar os certificados no momento. Verifique sua conexão com a
                  internet ou se as credenciais do banco de dados estão corretas.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => fetchCertificates()}
                >
                  Tentar Novamente
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center h-48 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed p-6">
            <DatabaseIcon className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhum certificado encontrado</h3>
            <p className="text-muted-foreground max-w-md">
              Não há certificados cadastrados no momento. Por favor, volte mais tarde.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                type={cert.title}
                description={cleanText(cert.description)}
                benefits={
                  cert.benefits
                    ? String(cert.benefits)
                        .split(',')
                        .map((b) => cleanText(b))
                        .filter(Boolean)
                    : []
                }
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
                Sua solicitação foi enviada com sucesso! Em breve entraremos em contato.
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
                            <Input placeholder="Seu nome completo" {...field} />
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
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da sua empresa" {...field} />
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
                          <FormLabel>Telefone / WhatsApp</FormLabel>
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
                              <SelectItem value="e-CNPJ A3">e-CNPJ A3</SelectItem>
                              <SelectItem value="e-CNPJ A1">e-CNPJ A1</SelectItem>
                              <SelectItem value="e-CPF A3">e-CPF A3</SelectItem>
                              <SelectItem value="e-CPF A1">e-CPF A1</SelectItem>
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
