import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Info } from 'lucide-react'
import { PSYCHO_DIMENSIONS, calculatePsychoScores } from '@/lib/psycho-eval'

export default function AvaliacaoPsicossocialPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [identificacao, setIdentificacao] = useState({
    nome: '',
    empresa: '',
    departamento: '',
    cargo: '',
    tempo_empresa: '',
  })
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [qualitative, setQualitative] = useState({ q46: '', q47: '' })

  const handleNext = () => {
    if (step === 1) {
      if (
        !identificacao.nome ||
        !identificacao.empresa ||
        !identificacao.departamento ||
        !identificacao.cargo ||
        !identificacao.tempo_empresa
      ) {
        toast.error('Preencha todos os campos de identificação.')
        return
      }
    }
    if (step === 2) {
      const allAnswered = PSYCHO_DIMENSIONS.every((dim) =>
        dim.questions.every((q) => answers[q.id]),
      )
      if (!allAnswered) {
        toast.error('Por favor, responda todas as 45 questões antes de prosseguir.')
        return
      }
    }
    setStep((s) => s + 1)
  }

  const handlePrev = () => setStep((s) => s - 1)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { dimensionScores, pontuacao_geral } = calculatePsychoScores(answers)

      const completas = PSYCHO_DIMENSIONS.flatMap((dim) =>
        dim.questions.map((q) => ({
          id: q.id,
          text: q.text,
          answer: answers[q.id],
        })),
      )

      const payload = {
        user_id: user?.id,
        nome: identificacao.nome,
        empresa: identificacao.empresa,
        departamento: identificacao.departamento,
        cargo: identificacao.cargo,
        tempo_empresa: Number(identificacao.tempo_empresa),
        status: 'concluida',
        data_conclusao: new Date().toISOString(),
        pontuacao_geral,
        respostas: {
          dimensionScores,
          qualitativas: qualitative,
          completas,
          rawAnswers: answers,
        },
      }

      await pb.collection('avaliacoes_psicossociais').create(payload)
      setIsSuccess(true)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao enviar avaliação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-2xl shadow-sm border animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold">Avaliação Concluída!</h1>
          <p className="text-muted-foreground">
            Sua avaliação psicossocial (NR-1) foi registrada com sucesso. Os dados serão tratados de
            forma anônima e confidencial.
          </p>
          <Button onClick={() => navigate('/')} className="w-full">
            Voltar para o Início
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-8 bg-primary/5 border-b">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">Avaliação Psicossocial (NR-1)</h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-3xl">
              Este questionário integra o processo de Gerenciamento de Riscos Ocupacionais (GRO).
              Seu objetivo é identificar e mensurar os Fatores de Risco Psicossocial Relacionados ao
              Trabalho.
            </p>
          </div>

          <div className="p-8">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b text-sm font-medium">
              <div
                className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary/10' : ''}`}
                >
                  1
                </div>
                <span className="hidden sm:inline">Identificação</span>
              </div>
              <div className="flex-1 border-t-2 mx-4 border-dashed border-muted-foreground/20"></div>
              <div
                className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary/10' : ''}`}
                >
                  2
                </div>
                <span className="hidden sm:inline">Questionário (45)</span>
              </div>
              <div className="flex-1 border-t-2 mx-4 border-dashed border-muted-foreground/20"></div>
              <div
                className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary/10' : ''}`}
                >
                  3
                </div>
                <span className="hidden sm:inline">Finalização</span>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Identificação do Respondente</h2>
                  <p className="text-sm text-muted-foreground">
                    Preencha os campos abaixo. Estes dados são confidenciais.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input
                      value={identificacao.nome}
                      onChange={(e) => setIdentificacao({ ...identificacao, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input
                      value={identificacao.empresa}
                      onChange={(e) =>
                        setIdentificacao({ ...identificacao, empresa: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Departamento/Setor</Label>
                    <Input
                      value={identificacao.departamento}
                      onChange={(e) =>
                        setIdentificacao({ ...identificacao, departamento: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo Atual</Label>
                    <Input
                      value={identificacao.cargo}
                      onChange={(e) =>
                        setIdentificacao({ ...identificacao, cargo: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Tempo na empresa (em meses)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={identificacao.tempo_empresa}
                      onChange={(e) =>
                        setIdentificacao({ ...identificacao, tempo_empresa: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-fade-in">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-4 text-blue-800">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Escala de Resposta:</p>
                    <p>
                      1 = Discordo totalmente | 2 = Discordo parcialmente | 3 = Nem concordo nem
                      discordo | 4 = Concordo parcialmente | 5 = Concordo totalmente
                    </p>
                  </div>
                </div>

                {PSYCHO_DIMENSIONS.map((dim) => (
                  <div key={dim.id} className="space-y-6">
                    <h3 className="text-lg font-bold border-b pb-2 text-primary">
                      Dimensão {dim.id} — {dim.title}
                    </h3>
                    {dim.questions.map((q) => (
                      <div
                        key={q.id}
                        className="bg-muted/30 p-5 rounded-xl border hover:border-primary/30 transition-colors"
                      >
                        <p className="font-medium text-[15px] mb-4">{q.text}</p>
                        <RadioGroup
                          className="flex gap-4 sm:gap-8 flex-wrap"
                          value={answers[q.id]}
                          onValueChange={(val) => setAnswers({ ...answers, [q.id]: val })}
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className="flex items-center space-x-2">
                              <RadioGroupItem value={num.toString()} id={`${q.id}-${num}`} />
                              <Label
                                htmlFor={`${q.id}-${num}`}
                                className="font-normal cursor-pointer p-1"
                              >
                                {num}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Informações Complementares</h2>
                  <p className="text-sm text-muted-foreground">
                    Espaço para comentários adicionais (Opcional).
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>
                      46. Existe alguma pergunta relacionada ao seu ambiente de trabalho que não foi
                      feita anteriormente e que você gostaria de responder?
                    </Label>
                    <Textarea
                      rows={4}
                      placeholder="Descreva aqui..."
                      value={qualitative.q46}
                      onChange={(e) => setQualitative({ ...qualitative, q46: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      47. Que sugestões você daria para melhorar o ambiente psicossocial na sua
                      área?
                    </Label>
                    <Textarea
                      rows={4}
                      placeholder="Suas sugestões..."
                      value={qualitative.q47}
                      onChange={(e) => setQualitative({ ...qualitative, q47: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-10 pt-6 border-t">
              <Button variant="outline" onClick={handlePrev} disabled={step === 1}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
              {step < 3 ? (
                <Button onClick={handleNext}>
                  Próximo <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                  {isSubmitting ? 'Enviando...' : 'Finalizar Avaliação'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
