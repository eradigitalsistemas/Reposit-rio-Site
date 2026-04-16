import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { sendEmailWithRetry } from '@/lib/email'
import { formatPhone } from '@/lib/utils'

const leadSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(14, 'Telefone incompleto'),
  company: z.string().min(2, 'Empresa é obrigatória'),
  details: z.string().min(5, 'Detalhes são obrigatórios'),
})

export function RegistrationFormSection() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: '', email: '', phone: '', company: '', details: '' },
  })

  async function onSubmit(values: z.infer<typeof leadSchema>) {
    setIsSubmitting(true)
    try {
      // 1. Database insertion
      const { error: dbError } = await supabase.from('leads').insert({
        nome: values.name,
        email: values.email,
        telefone: values.phone,
        empresa: values.company,
        observacoes: values.details,
        estagio: 'Novo',
        status_interesse: 'Interessado',
      } as any)

      if (dbError) throw dbError

      // 2. Email payload preparation
      const clientPayload = {
        type: 'client_confirmation',
        clientEmail: values.email,
        clientName: values.name,
        subject: 'Bem-vindo ao Planejador Financeiro',
        from: 'suporte@seudominio',
        registrationSummary: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
        },
        accessLink: window.location.origin,
      }

      const internalPayload = {
        type: 'internal_notification',
        teamEmail: 'comercial@aeradigital.com.br',
        subject: `Nova Solicitação de Cadastro - ${values.name}`,
        from: 'noreply@seudominio',
        clientData: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          registrationDetails: values.details,
        },
      }

      // 3. Trigger edge function with retries
      await Promise.all([sendEmailWithRetry(clientPayload), sendEmailWithRetry(internalPayload)])

      setIsSuccess(true)
      toast({
        title: 'Sucesso!',
        description: 'Cadastro realizado com sucesso! Confira seu e-mail para mais detalhes',
      })
      form.reset()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: err.message || 'Ocorreu um erro ao processar seu cadastro.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6 p-8 bg-slate-50 rounded-xl border max-w-2xl mx-auto animate-fade-in">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
        <h2 className="text-2xl font-bold">Cadastro realizado com sucesso!</h2>
        <p className="text-muted-foreground">Confira seu e-mail para mais detalhes.</p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Fazer novo cadastro
        </Button>
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto text-left shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle>Solicite um Contato</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para iniciar sua jornada conosco.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
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
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
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
                name="company"
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
            </div>
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalhes do Projeto</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte-nos um pouco sobre sua necessidade..."
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Cadastro
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
