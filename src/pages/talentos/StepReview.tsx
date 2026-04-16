import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { TalentosFormValues } from './schema'

interface StepReviewProps {
  setCurrentStep: (step: number) => void
}

export function StepReview({ setCurrentStep }: StepReviewProps) {
  const { getValues } = useFormContext<TalentosFormValues>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const values = getValues()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      let scoreD = 0,
        scoreI = 0,
        scoreS = 0,
        scoreC = 0
      if (values.disc) {
        Object.values(values.disc).forEach((ans) => {
          if (ans === 'D') scoreD++
          if (ans === 'I') scoreI++
          if (ans === 'S') scoreS++
          if (ans === 'C') scoreC++
        })
      }

      const scores = [
        { type: 'Dominância (D)', value: scoreD },
        { type: 'Influência (I)', value: scoreI },
        { type: 'Estabilidade (S)', value: scoreS },
        { type: 'Conformidade (C)', value: scoreC },
      ].sort((a, b) => b.value - a.value)

      let tipoPerfil = scores[0].type
      if (scores[0].value === scores[1].value && scores[0].value > 0) {
        tipoPerfil = `${scores[0].type.split(' ')[0]} / ${scores[1].type.split(' ')[0]}`
      }

      let dataNascimento = null
      if (values.personal?.data_nascimento) {
        dataNascimento = new Date(values.personal.data_nascimento).toISOString()
      }

      await pb.collection('candidatos').create({
        nome: values.personal?.nome,
        email: values.personal?.email,
        telefone: values.personal?.telefone,
        endereco: values.personal?.endereco,
        data_nascimento: dataNascimento,
        formacoes: values.educations || [],
        experiencias: values.experiences || [],
        disc_respondido: !!values.disc,
        disc_resultado: values.disc
          ? {
              pontuacao_d: scoreD,
              pontuacao_i: scoreI,
              pontuacao_s: scoreS,
              pontuacao_c: scoreC,
              tipo_perfil: tipoPerfil,
            }
          : null,
        status: 'Novo',
        origem: 'Site',
      })

      toast({
        title: 'Sucesso!',
        description: 'Seu currículo foi gerado e enviado com sucesso.',
      })

      localStorage.setItem('talentos_form_data', JSON.stringify(values))
      localStorage.setItem('talentos_generated_at', new Date().toISOString())

      navigate('/talentos/sucesso')
    } catch (error: any) {
      console.error('Error submitting resume:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar currículo',
        description:
          error?.message || 'Ocorreu um erro inesperado. Verifique os dados e tente novamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Quase lá, {values.personal?.nome}!</h3>
        <p className="text-muted-foreground">
          Revise seus dados abaixo. Se estiver tudo certo, clique em gerar e enviar currículo.
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

      <div className="flex justify-center pt-8 pb-4">
        <Button
          type="button"
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[280px] text-base h-12"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processando e Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Gerar e Enviar Currículo
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
