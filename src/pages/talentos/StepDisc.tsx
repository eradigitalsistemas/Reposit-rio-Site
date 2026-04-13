import { useFormContext } from 'react-hook-form'
import { BrainCircuit } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { TalentosFormValues } from './schema'

const questions = [
  {
    id: 'q1',
    label: '1. Em um projeto novo com prazo apertado, minha reação típica é:',
    options: [
      { value: 'D', text: 'Assumir a liderança e focar imediatamente nos resultados (Dominância)' },
      { value: 'I', text: 'Engajar a equipe para manter o ânimo e a criatividade (Influência)' },
      {
        value: 'S',
        text: 'Buscar colaboração e garantir que todos saibam o que fazer (Estabilidade)',
      },
      {
        value: 'C',
        text: 'Analisar os requisitos detalhadamente para evitar erros (Conformidade)',
      },
    ],
  },
  {
    id: 'q2',
    label: '2. Ao tomar uma decisão importante, eu geralmente:',
    options: [
      { value: 'D', text: 'Decido rápido e assumo os riscos envolvidos' },
      { value: 'I', text: 'Sigo minha intuição e converso com outras pessoas' },
      { value: 'S', text: 'Prefiro decisões que mantenham a harmonia e a rotina' },
      { value: 'C', text: 'Preciso de fatos, dados e uma análise cuidadosa' },
    ],
  },
  {
    id: 'q3',
    label: '3. Meu maior incômodo no ambiente de trabalho é:',
    options: [
      { value: 'D', text: 'Falta de autonomia e lentidão na execução' },
      { value: 'I', text: 'Ambientes frios e isolamento social' },
      { value: 'S', text: 'Mudanças constantes e falta de previsibilidade' },
      { value: 'C', text: 'Desorganização e regras não cumpridas' },
    ],
  },
  {
    id: 'q4',
    label: '4. Eu me considero uma pessoa que é principalmente:',
    options: [
      { value: 'D', text: 'Competitiva e focada no objetivo' },
      { value: 'I', text: 'Comunicativa e entusiasta' },
      { value: 'S', text: 'Paciente e excelente ouvinte' },
      { value: 'C', text: 'Precisa e analítica' },
    ],
  },
] as const

export function StepDisc() {
  const { control } = useFormContext<TalentosFormValues>()

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-secondary" /> Análise de Perfil DISC
        </h3>
        <p className="text-sm text-muted-foreground">
          Responda rapidamente as perguntas abaixo escolhendo a opção que mais se alinha com seu
          comportamento natural.
        </p>
      </div>

      <div className="space-y-8 bg-muted/30 p-6 rounded-lg border">
        {questions.map((q) => (
          <FormField
            key={q.id}
            control={control}
            name={`disc.${q.id}` as any}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">{q.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    {q.options.map((opt) => (
                      <FormItem key={opt.value} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={opt.value} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer leading-snug">
                          {opt.text}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      <div className="pt-4 border-t">
        <FormField
          control={control}
          name="lgpd"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-semibold">Consentimento LGPD</FormLabel>
                <FormDescription>
                  Confirmo a veracidade das informações fornecidas e concordo que a Super Era
                  Digital armazene meu currículo e dados da análise DISC em seu Banco de Talentos
                  para futuras oportunidades, conforme a Política de Privacidade.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
