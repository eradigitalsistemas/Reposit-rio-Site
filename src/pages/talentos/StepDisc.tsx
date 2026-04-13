import { useState, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const discQuestions = [
  {
    id: 'q1',
    text: '1. Em situações de conflito ou pressão, eu costumo:',
    options: [
      { value: 'D', label: 'Assumir o controle e buscar uma solução rápida.' },
      { value: 'I', label: 'Tentar aliviar a tensão com humor ou persuasão.' },
      { value: 'S', label: 'Manter a calma e tentar apaziguar as partes.' },
      { value: 'C', label: 'Analisar os fatos e buscar uma saída lógica.' },
    ],
  },
  {
    id: 'q2',
    text: '2. Ao trabalhar em equipe, minha maior contribuição é:',
    options: [
      { value: 'I', label: 'Motivar e inspirar os outros.' },
      { value: 'S', label: 'Apoiar e cooperar com todos.' },
      { value: 'C', label: 'Garantir precisão e qualidade.' },
      { value: 'D', label: 'Liderar e focar nos resultados.' },
    ],
  },
  {
    id: 'q3',
    text: '3. Meu ritmo de trabalho ideal é:',
    options: [
      { value: 'S', label: 'Constante, previsível e sem muitas pressas.' },
      { value: 'D', label: 'Acelerado, focado em metas rápidas.' },
      { value: 'C', label: 'Cuidadoso, com tempo para analisar detalhes.' },
      { value: 'I', label: 'Dinâmico, com bastante interação e novidades.' },
    ],
  },
  {
    id: 'q4',
    text: '4. Quando preciso tomar uma decisão importante, eu:',
    options: [
      { value: 'C', label: 'Reúno todos os dados possíveis antes de decidir.' },
      { value: 'D', label: 'Decido rapidamente com base no meu instinto.' },
      { value: 'I', label: 'Gosto de debater a ideia com outras pessoas.' },
      { value: 'S', label: 'Prefiro decisões que não causem grandes mudanças repentinas.' },
    ],
  },
  {
    id: 'q5',
    text: '5. A forma como eu prefiro me comunicar é:',
    options: [
      { value: 'D', label: 'Direta e direto ao ponto.' },
      { value: 'I', label: 'Entusiástica e expressiva.' },
      { value: 'S', label: 'Amigável e acolhedora.' },
      { value: 'C', label: 'Detalhada e por escrito.' },
    ],
  },
  {
    id: 'q6',
    text: '6. Diante de mudanças, minha reação típica é:',
    options: [
      { value: 'I', label: 'Ficar empolgado com as novas possibilidades.' },
      { value: 'S', label: 'Precisar de um tempo para me adaptar e entender o impacto.' },
      { value: 'C', label: 'Querer saber exatamente como as coisas vão funcionar.' },
      { value: 'D', label: 'Ver como uma oportunidade de melhorar e avançar.' },
    ],
  },
  {
    id: 'q7',
    text: '7. O que mais me frustra no ambiente de trabalho?',
    options: [
      { value: 'S', label: 'Falta de harmonia e conflitos constantes.' },
      { value: 'C', label: 'Desorganização e regras não sendo seguidas.' },
      { value: 'D', label: 'Lentidão e falta de autonomia.' },
      { value: 'I', label: 'Rotina rígida e falta de interação social.' },
    ],
  },
  {
    id: 'q8',
    text: '8. Como eu geralmente organizo minhas tarefas?',
    options: [
      { value: 'C', label: 'Crio listas detalhadas e sigo uma ordem estrita.' },
      { value: 'D', label: 'Priorizo o que dá mais resultado e delego o resto.' },
      { value: 'S', label: 'Faço uma coisa de cada vez, do início ao fim.' },
      { value: 'I', label: 'Tento fazer várias coisas e mudo conforme a inspiração.' },
    ],
  },
  {
    id: 'q9',
    text: '9. Meu estilo de liderança (ou como eu lideraria) é:',
    options: [
      { value: 'D', label: 'Focado no objetivo e exigente.' },
      { value: 'I', label: 'Carismático e focado nas pessoas.' },
      { value: 'S', label: 'Participativo e focado no bem-estar.' },
      { value: 'C', label: 'Orientado a processos e qualidade.' },
    ],
  },
  {
    id: 'q10',
    text: '10. Em um novo projeto, minha primeira ação é:',
    options: [
      { value: 'I', label: 'Conversar com as pessoas envolvidas para trocar ideias.' },
      { value: 'D', label: 'Definir as metas e o que precisa ser alcançado.' },
      { value: 'C', label: 'Planejar as etapas e os recursos necessários.' },
      { value: 'S', label: 'Garantir que a equipe está confortável com o que será feito.' },
    ],
  },
  {
    id: 'q11',
    text: '11. Se eu cometo um erro, eu:',
    options: [
      { value: 'C', label: 'Analiso o que deu errado para nunca mais repetir.' },
      { value: 'S', label: 'Sinto muito e peço desculpas para manter a paz.' },
      { value: 'I', label: 'Tento contornar a situação de forma otimista.' },
      { value: 'D', label: 'Corrijo imediatamente e sigo em frente.' },
    ],
  },
  {
    id: 'q12',
    text: '12. Para mim, o sucesso significa:',
    options: [
      { value: 'S', label: 'Estabilidade, segurança e bons relacionamentos.' },
      { value: 'I', label: 'Reconhecimento, popularidade e impacto nas pessoas.' },
      { value: 'D', label: 'Alcançar metas difíceis e ser o melhor.' },
      { value: 'C', label: 'Fazer um trabalho de excelência e ser respeitado por isso.' },
    ],
  },
]

export function StepDisc({ onComplete }: { onComplete?: () => void }) {
  const { control, watch, trigger } = useFormContext()
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentQ = discQuestions[currentIndex]
  const allAnswers = watch('disc') || {}

  const isAnswered = !!allAnswers[currentQ.id]

  const handleNext = () => {
    if (currentIndex < discQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const progress = ((currentIndex + 1) / discQuestions.length) * 100
  const isFinished = Object.values(allAnswers).filter(Boolean).length === 12

  // Force validation to update parent form's isValid state when finished
  useEffect(() => {
    if (isFinished) {
      trigger()
    }
  }, [isFinished, trigger])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold">Descubra seu Perfil Comportamental com o Teste DISC</h3>
        <p className="text-muted-foreground mt-2">
          Responda com sinceridade. Não há respostas certas ou erradas.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
          <span>
            Pergunta {currentIndex + 1} de {discQuestions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />

        <Card className="mt-8 border-primary/20 shadow-sm relative overflow-hidden">
          <CardContent className="p-6 md:p-8 relative z-10 bg-card">
            <h4 className="text-xl font-medium mb-6 min-h-[56px] flex items-center">
              {currentQ.text}
            </h4>

            <Controller
              name={`disc.${currentQ.id}`}
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  {currentQ.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        'flex items-center p-4 border rounded-xl cursor-pointer transition-all',
                        field.value === opt.value
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-muted hover:border-primary/50 hover:bg-muted/50',
                      )}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        value={opt.value}
                        checked={field.value === opt.value}
                        onChange={async (e) => {
                          field.onChange(e.target.value)
                          await trigger(`disc.${currentQ.id}`)

                          if (currentIndex < discQuestions.length - 1) {
                            setTimeout(() => handleNext(), 350)
                          } else {
                            // Ensure overall form validation gets updated when clicking the last option
                            const isValid = await trigger()
                            if (isValid && onComplete) {
                              setTimeout(() => onComplete(), 600)
                            }
                          }
                        }}
                      />
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-colors',
                          field.value === opt.value ? 'border-primary' : 'border-muted-foreground',
                        )}
                      >
                        {field.value === opt.value && (
                          <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                        )}
                      </div>
                      <span className="text-sm md:text-base font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
          </Button>

          {currentIndex < discQuestions.length - 1 ? (
            <Button type="button" onClick={handleNext} disabled={!isAnswered}>
              Próxima Pergunta <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="text-green-600 dark:text-green-500 font-medium flex items-center">
              {isFinished && (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Teste Concluído
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
