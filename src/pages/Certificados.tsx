import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Loader2,
  CheckCircle2,
  MessageCircle,
  FileKey2,
  ShieldCheck,
  Clock,
  Building2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const formSchema = z.object({
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
    defaultValues: { email: '', tipo_certificado: '', telefone: '', lgpd: false },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('leads_certificados').insert({
        email: values.email,
        tipo_certificado: values.tipo_certificado,
        telefone: values.telefone,
        data_contato: new Date().toISOString(),
      })
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

  const whatsappUrl =
    'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20Certificados%20Digitais.'

  return (
    <div className="space-y-16 pb-10 animate-fade-in">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Certificados Digitais
        </h1>
        <p className="text-lg text-muted-foreground">
          Segurança, validade jurídica e agilidade para suas transações online. Escolha o
          certificado ideal para você ou sua empresa.
        </p>
        <div className="flex justify-center pt-4">
          <Button size="lg" className="bg-[#25D366] hover:bg-[#20bd5a] text-white" asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicitar via WhatsApp
            </a>
          </Button>
        </div>
      </section>

      {/* Types of Certificates */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'e-CPF A1',
            icon: FileKey2,
            desc: 'Instalado no computador, validade de 1 ano. Ideal para pessoas físicas.',
          },
          {
            title: 'e-CPF A3',
            icon: ShieldCheck,
            desc: 'Armazenado em token ou cartão, validade de 1 a 3 anos. Maior segurança física.',
          },
          {
            title: 'e-CNPJ A1',
            icon: Building2,
            desc: 'Identidade digital da sua empresa no computador, validade de 1 ano.',
          },
          {
            title: 'e-CNPJ A3',
            icon: Clock,
            desc: 'Identidade PJ em mídia física, validade de 1 a 3 anos.',
          },
        ].map((cert, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <cert.icon className="h-8 w-8 text-secondary mb-2" />
              <CardTitle>{cert.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">{cert.desc}</CardContent>
          </Card>
        ))}
      </section>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* FAQ Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Dúvidas Frequentes</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>O que é um Certificado Digital?</AccordionTrigger>
              <AccordionContent>
                É a identidade eletrônica de uma pessoa ou empresa. Ele funciona como uma carteira
                de identidade virtual que permite assinar documentos com validade jurídica.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Qual a diferença entre A1 e A3?</AccordionTrigger>
              <AccordionContent>
                O certificado A1 é emitido e armazenado no computador (software) com validade de 1
                ano. O A3 é armazenado em mídia criptográfica (Token ou Cartão Inteligente) com
                validade de até 3 anos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Preciso ir presencialmente para emitir?</AccordionTrigger>
              <AccordionContent>
                Em muitos casos, se você já possui biometria cadastrada no sistema ou CNH digital, a
                emissão pode ser feita 100% por videoconferência.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
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
                          <FormLabel>Tipo de Certificado</FormLabel>
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
                            <FormLabel>Termos de Privacidade (LGPD)</FormLabel>
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
