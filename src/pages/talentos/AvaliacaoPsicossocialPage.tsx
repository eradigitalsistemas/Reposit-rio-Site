import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PSYCHO_DIMENSIONS, calculatePsychoScores } from '@/lib/psycho-eval'

const identificacaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  empresa: z.string().min(1, 'Empresa é obrigatória'),
  departamento: z.string().min(1, 'Departamento é obrigatório'),
  cargo: z.string().min(1, 'Cargo é obrigatório'),
  tempoMeses: z.coerce.number().min(0, 'Tempo inválido'),
  data: z.string().min(1, 'Data é obrigatória'),
})

const schema = z.object({
  identificacao: identificacaoSchema,
  respostas: z.record(z.string(), z.coerce.number().min(1).max(5)),
  qualitativas: z
    .object({
      q46: z.string().optional(),
      q47: z.string().optional(),
    })
    .optional(),
})

type FormData = z.infer<typeof schema>

const SCALE_OPTIONS = [
  { value: 1, label: '1. Discordo totalmente' },
  { value: 2, label: '2. Discordo parcialmente' },
  { value: 3, label: '3. Nem concordo nem discordo' },
  { value: 4, label: '4. Concordo parcialmente' },
  { value: 5, label: '5. Concordo totalmente' },
]

export default function AvaliacaoPsicossocialPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    register,
    getValues,
    trigger,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      identificacao: {
        nome: user?.name || '',
        data: format(new Date(), 'yyyy-MM-dd'),
      },
      respostas: {},
      qualitativas: {},
    },
  })

  const handleNext = async () => {
    let fieldsToValidate: any[] = []

    if (step === 0) {
      fieldsToValidate = [
        'identificacao.nome',
        'identificacao.empresa',
        'identificacao.departamento',
        'identificacao.cargo',
        'identificacao.tempoMeses',
        'identificacao.data',
      ]
    } else if (step >= 1 && step <= 8) {
      const dim = PSYCHO_DIMENSIONS[step - 1]
      fieldsToValidate = dim.questions.map((q) => `respostas.${q.id}`)

      const currentValues = getValues('respostas') || {}
      const missing = dim.questions.filter((q) => !currentValues[q.id])
      if (missing.length > 0) {
        missing.forEach((q) =>
          setError(`respostas.${q.id}` as any, { type: 'manual', message: 'Resposta obrigatória' }),
        )
        toast.error('Por favor, responda todas as questões desta etapa.')
        return
      }
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      clearErrors()
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      const { dimensionScores, pontuacao_geral } = calculatePsychoScores(data.respostas)

      const payload = {
        user_id: user?.id,
        respostas: {
          identificacao: data.identificacao,
          respostas: data.respostas,
          qualitativas: data.qualitativas,
          dimensionScores,
        },
        status: 'concluido',
        data_conclusao: new Date().toISOString(),
        pontuacao_geral,
      }

      await pb.collection('avaliacoes_psicossociais').create(payload)
      toast.success('Avaliação enviada com sucesso!')
      navigate('/talentos')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao enviar avaliação.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/20 py-10">
      <div className="container mx-auto px-4 max-w-4xl animate-fade-in-up">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Avaliação Psicossocial</h1>
              <p className="text-sm text-muted-foreground">
                NR-1 • Gerenciamento de Riscos Ocupacionais
              </p>
            </div>
            <div className="text-right whitespace-nowrap">
              <p className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                Passo {step + 1} de 10
              </p>
            </div>
          </div>

          <Progress value={((step + 1) / 10) * 100} className="h-2" />

          <Card className="shadow-sm">
            <CardContent className="p-6 sm:p-8">
              {step === 0 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 space-y-4 text-sm text-foreground/90">
                    <h3 className="text-lg font-bold text-foreground">
                      Instruções Gerais de Preenchimento
                    </h3>
                    <p>
                      Este questionário integra o processo de{' '}
                      <strong>Gerenciamento de Riscos Ocupacionais (GRO)</strong> previsto na{' '}
                      <strong>
                        NR-1 (Portaria MTP nº 1.419/2024, vigente desde 26 de maio de 2026)
                      </strong>
                      . Seu objetivo é identificar e mensurar os Fatores de Risco Psicossocial
                      Relacionados ao Trabalho (FRPRT) presentes na organização, permitindo o
                      planejamento de ações preventivas e corretivas.
                    </p>
                    <p>
                      O questionário está organizado em oito dimensões de risco psicossocial. Leia
                      cada afirmativa e assinale, na escala de cinco pontos, o quanto você concorda
                      ou discorda dela, considerando sua experiência nos últimos seis meses. Não
                      existem respostas certas ou erradas — a sinceridade é fundamental para a
                      precisão do diagnóstico.
                    </p>
                    <div className="bg-background/80 p-4 rounded-md mt-4 border text-xs sm:text-sm shadow-sm">
                      <strong>Importante:</strong> Este questionário é CONFIDENCIAL. Os dados serão
                      tratados de forma anônima e agregada, conforme a Lei Geral de Proteção de
                      Dados Pessoais (LGPD – Lei nº 13.709/2018). Nenhuma resposta individual será
                      utilizada para qualquer finalidade disciplinar ou avaliativa individual.
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">
                      1. Identificação do Respondente
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome Completo</Label>
                        <Input {...register('identificacao.nome')} placeholder="Seu nome" />
                        {errors.identificacao?.nome && (
                          <span className="text-xs text-destructive">
                            {errors.identificacao.nome.message}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Empresa</Label>
                        <Input {...register('identificacao.empresa')} placeholder="Sua empresa" />
                        {errors.identificacao?.empresa && (
                          <span className="text-xs text-destructive">
                            {errors.identificacao.empresa.message}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Departamento/Setor</Label>
                        <Input
                          {...register('identificacao.departamento')}
                          placeholder="Seu setor"
                        />
                        {errors.identificacao?.departamento && (
                          <span className="text-xs text-destructive">
                            {errors.identificacao.departamento.message}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo Atual</Label>
                        <Input {...register('identificacao.cargo')} placeholder="Seu cargo" />
                        {errors.identificacao?.cargo && (
                          <span className="text-xs text-destructive">
                            {errors.identificacao.cargo.message}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Tempo na Empresa (em meses)</Label>
                        <Input
                          type="number"
                          {...register('identificacao.tempoMeses')}
                          placeholder="Ex: 12"
                        />
                        {errors.identificacao?.tempoMeses && (
                          <span className="text-xs text-destructive">
                            {errors.identificacao.tempoMeses.message}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Data de Preenchimento</Label>
                        <Input
                          type="date"
                          {...register('identificacao.data')}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step >= 1 && step <= 8 && (
                <div className="space-y-6 animate-fade-in">
                  {(() => {
                    const dim = PSYCHO_DIMENSIONS[step - 1]
                    return (
                      <>
                        <h2 className="text-xl font-bold border-b pb-2 text-primary">
                          DIMENSÃO {dim.id} — {dim.title}
                        </h2>
                        <div className="space-y-6">
                          {dim.questions.map((q) => (
                            <div
                              key={q.id}
                              className="p-5 bg-muted/20 rounded-lg border shadow-sm transition-colors hover:bg-muted/30"
                            >
                              <Label className="text-base leading-relaxed font-medium mb-3 block">
                                {q.text}
                              </Label>
                              <Controller
                                name={`respostas.${q.id}`}
                                control={control}
                                render={({ field }) => (
                                  <RadioGroup
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
                                    className="flex flex-col gap-3 mt-3 ml-1"
                                  >
                                    {SCALE_OPTIONS.map((opt) => (
                                      <div key={opt.value} className="flex items-center space-x-3">
                                        <RadioGroupItem
                                          value={opt.value.toString()}
                                          id={`${q.id}-${opt.value}`}
                                        />
                                        <Label
                                          htmlFor={`${q.id}-${opt.value}`}
                                          className="font-normal cursor-pointer text-sm leading-none"
                                        >
                                          {opt.label}
                                        </Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                )}
                              />
                              {errors.respostas?.[q.id] && (
                                <p className="text-sm text-destructive mt-3 font-medium">
                                  ⚠️ Resposta obrigatória
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}

              {step === 9 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold border-b pb-2">Informações Complementares</h2>
                  <p className="text-sm text-muted-foreground">
                    Responda voluntariamente a estas perguntas abertas (opcional):
                  </p>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        46. Existe algum fator de risco psicossocial que não foi abordado nas
                        questões anteriores e que você gostaria de destacar?
                      </Label>
                      <Textarea
                        {...register('qualitativas.q46')}
                        rows={4}
                        placeholder="Sua resposta (opcional)..."
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        47. Que sugestões você daria para melhorar o ambiente psicossocial na sua
                        área?
                      </Label>
                      <Textarea
                        {...register('qualitativas.q47')}
                        rows={4}
                        placeholder="Sua resposta (opcional)..."
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep((s) => Math.max(0, s - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={step === 0 || isSubmitting}
            >
              Voltar
            </Button>
            {step < 9 ? (
              <Button type="button" onClick={handleNext} className="min-w-[120px]">
                Avançar
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                {isSubmitting ? 'Enviando...' : 'Finalizar Avaliação'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
