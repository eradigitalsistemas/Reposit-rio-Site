import { useFormContext } from 'react-hook-form'
import { DISCQuiz } from '@/components/disc/DISCQuiz'

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
  const { setValue, watch, trigger } = useFormContext()
  const initialAnswers = watch('disc') || {}

  const handleOnChange = (answers: Record<string, string>) => {
    setValue('disc', answers, { shouldValidate: true })
    trigger('disc').catch(() => {})
  }

  const handleQuizComplete = (answers: Record<string, string>, scores: Record<string, number>) => {
    setValue('disc', answers, { shouldValidate: true })
    // In a real scenario you would save the 'scores' object, but for this step we advance the UI
    trigger('disc').catch(() => {})
    if (onComplete) onComplete()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold">Descubra seu Perfil Comportamental com o Teste DISC</h3>
        <p className="text-muted-foreground mt-2">
          Responda com sinceridade. Não há respostas certas ou erradas.
        </p>
      </div>

      <DISCQuiz
        questions={discQuestions}
        initialAnswers={initialAnswers}
        onChange={handleOnChange}
        onComplete={handleQuizComplete}
      />
    </div>
  )
}
