import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { talentosSchema, defaultTalentosValues, TalentosFormValues } from './schema'
import { StepPersonal } from './StepPersonal'
import { StepEducation } from './StepEducation'
import { StepExperience } from './StepExperience'
import { StepDisc } from './StepDisc'

const steps = [
  {
    id: 'personal',
    title: 'Dados Pessoais',
    fields: [
      'personal.nome',
      'personal.email',
      'personal.telefone',
      'personal.data_nascimento',
      'personal.endereco',
    ],
  },
  { id: 'education', title: 'Educação', fields: ['educations'] },
  { id: 'experience', title: 'Experiência', fields: ['experiences'] },
  {
    id: 'disc',
    title: 'Perfil DISC',
    fields: ['disc.q1', 'disc.q2', 'disc.q3', 'disc.q4', 'lgpd'],
  },
]

export default function TalentosPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const methods = useForm<TalentosFormValues>({
    resolver: zodResolver(talentosSchema),
    defaultValues: defaultTalentosValues,
    mode: 'onTouched',
  })

  const { trigger, handleSubmit } = methods

  const processDisc = (discData: any) => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }
    Object.values(discData).forEach((val: any) => {
      if (val === 'D') scores.D += 25
      if (val === 'I') scores.I += 25
      if (val === 'S') scores.S += 25
      if (val === 'C') scores.C += 25
    })
    // Simple logic to find predominant profile
    const profile = Object.keys(scores).reduce((a, b) =>
      scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b,
    )
    return { scores, profile }
  }

  const onSubmit = async (data: TalentosFormValues) => {
    setIsSubmitting(true)
    try {
      // 1. Insert User
      const userRes = await supabase.from('users').insert(data.personal)
      if (userRes.error) throw userRes.error
      const userId = userRes.data.id

      // 2. Insert Educations
      const eduData = data.educations.map((e) => ({ ...e, user_id: userId }))
      await supabase.from('educations').insert(eduData)

      // 3. Insert Experiences
      const expData = data.experiences.map((e) => ({ ...e, user_id: userId }))
      await supabase.from('experiences').insert(expData)

      // 4. Process & Insert DISC
      const { scores, profile } = processDisc(data.disc)
      await supabase.from('disc_results').insert({
        user_id: userId,
        tipo_perfil: profile,
        pontuacao_d: scores.D,
        pontuacao_i: scores.I,
        pontuacao_s: scores.S,
        pontuacao_c: scores.C,
        data_teste: new Date().toISOString(),
      })

      setIsSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: err.message || 'Ocorreu um erro na submissão.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep].fields
    const isStepValid = await trigger(fieldsToValidate as any)
    if (isStepValid) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center space-y-6 animate-fade-in">
        <div className="bg-accent/10 p-6 rounded-full inline-block">
          <CheckCircle2 className="h-24 w-24 text-accent" />
        </div>
        <h2 className="text-3xl font-bold">Perfil Cadastrado com Sucesso!</h2>
        <p className="text-lg text-muted-foreground">
          Obrigado por se juntar ao Banco de Talentos da Super Era Digital. Sua análise DISC e
          currículo já estão em nossa base.
        </p>
        <Button onClick={() => (window.location.href = '/')} variant="outline" className="mt-4">
          Voltar para Início
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-6 animate-fade-in">
      <div className="mb-8 sticky top-16 bg-background/95 pb-4 z-10 pt-4 -mt-4">
        <div className="flex justify-between text-sm font-medium mb-2 text-muted-foreground">
          <span>
            Passo {currentStep + 1} de {steps.length}
          </span>
          <span className="text-primary">{steps[currentStep].title}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg border-muted">
        <CardContent className="p-6 md:p-8">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="min-h-[400px]">
                {currentStep === 0 && <StepPersonal />}
                {currentStep === 1 && <StepEducation />}
                {currentStep === 2 && <StepExperience />}
                {currentStep === 3 && <StepDisc />}
              </div>

              <div className="flex justify-between items-center mt-12 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  disabled={currentStep === 0 || isSubmitting}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Próximo <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-accent hover:bg-accent/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Finalizar Cadastro
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
