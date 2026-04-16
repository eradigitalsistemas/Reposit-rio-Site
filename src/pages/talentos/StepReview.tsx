import { useFormContext } from 'react-hook-form'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TalentosFormValues } from './schema'

interface StepReviewProps {
  setCurrentStep: (step: number) => void
}

export function StepReview({ setCurrentStep }: StepReviewProps) {
  const { getValues } = useFormContext<TalentosFormValues>()
  const values = getValues()

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Quase lá, {values.personal?.nome}!</h3>
        <p className="text-muted-foreground">
          Revise seus dados abaixo. Se estiver tudo certo, clique em enviar candidatura.
        </p>
      </div>

      <div className="space-y-6 text-sm">
        <div className="p-4 border rounded-lg bg-card shadow-sm">
          <h4 className="font-semibold text-lg mb-3 flex items-center justify-between border-b pb-2">
            Dados Pessoais
            <Button type="button" variant="ghost" size="sm" onClick={() => setCurrentStep(0)}>
              Editar
            </Button>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                Nome
              </span>
              <span className="font-medium">{values.personal?.nome}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                E-mail
              </span>
              <span className="font-medium">{values.personal?.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                Telefone
              </span>
              <span className="font-medium">{values.personal?.telefone}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-card shadow-sm">
          <h4 className="font-semibold text-lg mb-3 flex items-center justify-between border-b pb-2">
            Educação
            <Button type="button" variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
              Editar
            </Button>
          </h4>
          <div className="mt-4 space-y-3">
            {values.educations?.map((edu: any, idx: number) => (
              <div key={idx} className="flex flex-col">
                <span className="font-medium text-base">{edu.curso}</span>
                <span className="text-muted-foreground">{edu.instituicao}</span>
              </div>
            ))}
            {(!values.educations || values.educations.length === 0) && (
              <span className="text-muted-foreground italic">Nenhuma educação informada.</span>
            )}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-card shadow-sm">
          <h4 className="font-semibold text-lg mb-3 flex items-center justify-between border-b pb-2">
            Experiência
            <Button type="button" variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
              Editar
            </Button>
          </h4>
          <div className="mt-4 space-y-3">
            {values.experiences?.map((exp: any, idx: number) => (
              <div key={idx} className="flex flex-col">
                <span className="font-medium text-base">{exp.cargo}</span>
                <span className="text-muted-foreground">{exp.empresa}</span>
              </div>
            ))}
            {(!values.experiences || values.experiences.length === 0) && (
              <span className="text-muted-foreground italic">Nenhuma experiência informada.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
