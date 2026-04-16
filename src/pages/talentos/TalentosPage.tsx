import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Save } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { talentosSchema, defaultTalentosValues, TalentosFormValues } from './schema'
import { StepPersonal } from './StepPersonal'
import { StepEducation } from './StepEducation'
import { StepExperience } from './StepExperience'
import { StepAdditional } from './StepAdditional'
import { StepDisc } from './StepDisc'
import { StepReview } from './StepReview'

const STORAGE_KEY = 'talentos_form_data'

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
      'personal.foto_url',
    ],
  },
  { id: 'education', title: 'Educação', fields: ['educations'] },
  { id: 'experience', title: 'Experiência', fields: ['experiences'] },
  { id: 'additional', title: 'Habilidades', fields: ['additional_info'] },
  { id: 'disc', title: 'Perfil DISC', fields: ['disc'] },
  { id: 'review', title: 'Revisão', fields: [] },
]

export default function TalentosPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'Salvando...' | 'Salvo' | ''>('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  const methods = useForm<TalentosFormValues>({
    resolver: zodResolver(talentosSchema),
    defaultValues: defaultTalentosValues as any,
    mode: 'onChange',
  })

  const {
    trigger,
    watch,
    reset,
    getValues,
    setError,
    formState: { errors },
  } = methods

  const formValues = watch()

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        reset(parsed)
      } catch (e) {
        // Ignore parse error
      }
    }
    setTimeout(() => {
      isInitialMount.current = false
    }, 100)
  }, [reset])

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getValues()))
    setSaveStatus('Salvando...')
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setSaveStatus('Salvo')
      setTimeout(() => setSaveStatus(''), 2000)
    }, 500)
  }

  const forceNextStep = () => {
    saveData()
    setCurrentStep((prev) => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = async () => {
    // Force transition if we are on DISC step
    if (currentStep === 4) {
      forceNextStep()
      return
    }

    const fieldsToValidate = steps[currentStep].fields
    const isStepValid = await trigger(fieldsToValidate as any)

    if (isStepValid) {
      if (currentStep === 0) {
        setIsCheckingEmail(true)
        const email = getValues('personal.email')
        try {
          const data = await pb.collection('users').getFirstListItem(`email="${email}"`)
          if (data) {
            setError('personal.email', {
              type: 'manual',
              message: 'Email já cadastrado. Deseja editar o currículo existente?',
            })
            setIsCheckingEmail(false)
            return
          }
        } catch (e) {
          // Ignora erros de rede localmente (ou quando o registro não existe)
        }
        setIsCheckingEmail(false)
      }

      forceNextStep()
    }
  }

  const handlePrev = () => {
    saveData()
    setCurrentStep((prev) => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmitFinal = async () => {
    setIsSubmitting(true)
    try {
      const values = getValues()
      const discValues = values.disc || {}
      const discAnsweredCount = Object.values(discValues).filter(
        (v) => typeof v === 'string' && v.trim() !== '',
      ).length

      await pb.collection('candidatos').create({
        nome: values.personal?.nome,
        email: values.personal?.email,
        telefone: values.personal?.telefone,
        formacoes: values.educations || [],
        experiencias: values.experiences || [],
        curriculo_url: values.personal?.foto_url || '',
        disc_respondido: discAnsweredCount > 0,
        disc_resultado: discValues,
        status: 'novo',
        origem: 'site',
        empresa_id: '00000000-0000-0000-0000-000000000000',
      })

      localStorage.removeItem(STORAGE_KEY)
      navigate('/talentos/sucesso')
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro ao enviar candidatura',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  const isNextDisabled = () => {
    if (currentStep === 0) {
      const p = formValues.personal
      if (!p?.nome || p.nome.length < 3) return true
      if (!p?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return true
      if (!p?.telefone) return true
      if (errors.personal && Object.keys(errors.personal).length > 0) return true
    }
    if (currentStep === 1) {
      const eds = formValues.educations
      if (!eds || eds.length === 0) return true
      const hasInvalidEdu = eds.some(
        (e: any) =>
          !e.instituicao ||
          e.instituicao.length < 2 ||
          !e.curso ||
          e.curso.length < 2 ||
          !e.data_inicio,
      )
      if (hasInvalidEdu) return true
      if (errors.educations && Object.keys(errors.educations).length > 0) return true
    }
    if (currentStep === 2) {
      const exps = formValues.experiences
      if (!exps || exps.length === 0) return true
      const hasInvalidExp = exps.some(
        (e: any) =>
          !e.empresa || e.empresa.length < 2 || !e.cargo || e.cargo.length < 2 || !e.data_inicio,
      )
      if (hasInvalidExp) return true
      if (errors.experiences && Object.keys(errors.experiences).length > 0) return true
    }
    if (currentStep === 3) {
      return false
    }
    if (currentStep === 4) {
      const d = formValues.disc || {}
      const answeredCount = Object.values(d).filter(
        (v) => typeof v === 'string' && v.trim() !== '',
      ).length
      if (answeredCount < 12) return true
      // Remove strict validation dependency to avoid locking UI
      return false
    }
    return false
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 animate-fade-in">
      <div className="mb-8 sticky top-[80px] bg-background/95 pb-4 z-10 pt-4 -mt-4 border-b">
        <div className="flex justify-between items-center text-sm font-medium mb-3">
          <div className="text-muted-foreground flex items-center gap-2">
            <span>
              Passo {currentStep + 1} de {steps.length}
            </span>
            <span className="hidden sm:inline-block">—</span>
            <span className="text-primary font-semibold">{steps[currentStep].title}</span>
          </div>
          <div className="text-xs flex items-center text-muted-foreground font-normal">
            {saveStatus === 'Salvando...' && <span className="animate-pulse">{saveStatus}</span>}
            {saveStatus === 'Salvo' && (
              <span className="flex items-center text-green-600 dark:text-green-500">
                <Save className="w-3.5 h-3.5 mr-1.5" /> Todos os dados salvos
              </span>
            )}
          </div>
        </div>
        <Progress value={progress} className="h-2 rounded-full" />
      </div>

      <Card className="shadow-lg border-muted">
        <CardContent className="p-6 md:p-10">
          <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="min-h-[400px]">
                {currentStep === 0 && <StepPersonal />}
                {currentStep === 1 && <StepEducation />}
                {currentStep === 2 && <StepExperience />}
                {currentStep === 3 && <StepAdditional />}
                {currentStep === 4 && <StepDisc onComplete={forceNextStep} />}
                {currentStep === 5 && <StepReview setCurrentStep={setCurrentStep} />}
              </div>

              <div className="flex justify-between items-center mt-12 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0 || isCheckingEmail || isSubmitting}
                  className="min-w-[100px]"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>

                {currentStep < 5 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isCheckingEmail || isNextDisabled()}
                    className="min-w-[120px]"
                  >
                    {isCheckingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {!isCheckingEmail && 'Próximo'}
                    {!isCheckingEmail && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmitFinal}
                    disabled={isSubmitting}
                    className="min-w-[200px]"
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {!isSubmitting && 'Enviar Candidatura'}
                    {!isSubmitting && <CheckCircle2 className="ml-2 h-4 w-4" />}
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
