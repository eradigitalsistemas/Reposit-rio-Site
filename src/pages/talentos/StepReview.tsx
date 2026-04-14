import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { jsPDF } from 'jspdf'
import { supabase } from '@/lib/supabase/client'
import { TalentosFormValues } from './schema'
import { Loader2, Pencil, CheckCircle2, AlertCircle } from 'lucide-react'

interface StepReviewProps {
  setCurrentStep: (step: number) => void
}

export function StepReview({ setCurrentStep }: StepReviewProps) {
  const {
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TalentosFormValues>()

  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const lgpd = watch('lgpd')
  const values = getValues()

  const calculateDisc = () => {
    let d = 0,
      i = 0,
      s = 0,
      c = 0
    Object.values(values.disc).forEach((v) => {
      if (v === 'D') d++
      if (v === 'I') i++
      if (v === 'S') s++
      if (v === 'C') c++
    })
    const scores = [
      { type: 'Dominância (D)', value: d, desc: 'Focado em resultados, direto e competitivo.' },
      { type: 'Influência (I)', value: i, desc: 'Comunicativo, persuasivo e otimista.' },
      { type: 'Estabilidade (S)', value: s, desc: 'Paciente, confiável e bom ouvinte.' },
      { type: 'Conformidade (C)', value: c, desc: 'Preciso, analítico e sistemático.' },
    ]
    scores.sort((a, b) => b.value - a.value)

    let tipoPerfil = scores[0].type
    let desc = scores[0].desc
    if (scores[0].value === scores[1].value) {
      tipoPerfil = `${scores[0].type} / ${scores[1].type}`
      desc = 'Perfil misto com características equilibradas.'
    }
    return { tipoPerfil, desc }
  }

  const discResult = calculateDisc()

  const generatePDF = async (): Promise<string> => {
    const doc = new jsPDF()
    const margin = 20
    const maxWidth = 170
    let y = margin

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(values.personal.nome, margin, y)
    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text(values.personal.email, margin, y)
    y += 6
    doc.text(values.personal.telefone, margin, y)
    y += 6
    if (values.personal.endereco) {
      doc.text(values.personal.endereco, margin, y)
      y += 6
    }

    y += 10

    const drawSection = (title: string) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(title, margin, y)
      doc.line(margin, y + 2, margin + maxWidth, y + 2)
      y += 10
    }

    const checkPageBreak = (neededSpace: number) => {
      if (y + neededSpace > 280) {
        doc.addPage()
        y = margin
      }
    }

    drawSection('Formação Acadêmica')
    doc.setFont('helvetica', 'normal')
    values.educations.forEach((ed) => {
      checkPageBreak(20)
      doc.setFont('helvetica', 'bold')
      doc.text(`${ed.curso} - ${ed.instituicao}`, margin, y)
      y += 6
      doc.setFont('helvetica', 'normal')
      doc.text(`Período: ${ed.data_inicio} a ${ed.data_fim || 'Atual'}`, margin, y)
      y += 10
    })

    y += 5
    checkPageBreak(20)
    drawSection('Experiência Profissional')
    doc.setFont('helvetica', 'normal')
    values.experiences.forEach((exp) => {
      checkPageBreak(25)
      doc.setFont('helvetica', 'bold')
      doc.text(`${exp.cargo} - ${exp.empresa}`, margin, y)
      y += 6
      doc.setFont('helvetica', 'normal')
      doc.text(`Período: ${exp.data_inicio} a ${exp.data_fim || 'Atual'}`, margin, y)
      y += 6
      if (exp.descricao) {
        const lines = doc.splitTextToSize(exp.descricao, maxWidth)
        checkPageBreak(lines.length * 6 + 5)
        doc.text(lines, margin, y)
        y += lines.length * 6
      }
      y += 8
    })

    const dateStr = new Date().toLocaleDateString('pt-BR')
    doc.setFontSize(10)
    doc.text(`Gerado em ${dateStr}`, margin, 285)

    return doc.output('datauristring')
  }

  const handleSubmit = async () => {
    setError(null)
    setIsSending(true)

    const payload = {
      ...values,
    }

    let attempt = 0
    let successReq = false

    while (attempt < 3 && !successReq) {
      try {
        const { data, error: invokeError } = await supabase.functions.invoke('submit-talento', {
          body: payload,
        })

        if (invokeError) throw new Error(invokeError.message)
        if (data?.error) throw new Error(data.error)

        successReq = true
      } catch (e: any) {
        attempt++
        if (attempt >= 3) {
          setError(
            `Erro ao enviar currículo: ${e.message || 'Falha de comunicação'}. Tente novamente.`,
          )
          setIsSending(false)
          return
        }
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)))
      }
    }

    setIsSending(false)
    setSuccess(true)
    localStorage.setItem('talentos_form_data', JSON.stringify(values))
    localStorage.setItem('talentos_generated_at', new Date().toISOString())
  }

  if (success) {
    return (
      <div className="text-center py-16 animate-fade-in space-y-6">
        <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Currículo Enviado!</h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Seus dados foram processados com sucesso. O seu perfil DISC e o currículo gerado foram
          encaminhados para a nossa equipe.
        </p>
        <div className="pt-8">
          <Button onClick={() => (window.location.href = '/')} size="lg">
            Voltar para o Início
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {values.personal.foto_url && (
          <img
            src={values.personal.foto_url}
            alt="Foto"
            className="w-32 h-32 rounded-full object-cover border-4 border-muted shadow-sm"
          />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{values.personal.nome}</h2>
              <p className="text-muted-foreground">
                {values.personal.email} | {values.personal.telefone}
              </p>
              {values.personal.endereco && (
                <p className="text-sm mt-1 text-muted-foreground">{values.personal.endereco}</p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(0)}>
              <Pencil className="w-4 h-4 mr-2" /> Editar Pessoais
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 border-b mb-4">
            <CardTitle className="text-lg">Educação</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="h-8">
              <Pencil className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {values.educations.map((ed, i) => (
              <div key={i} className="text-sm">
                <p className="font-bold text-base">{ed.curso}</p>
                <p className="text-muted-foreground text-base">{ed.instituicao}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {ed.data_inicio} até {ed.data_fim || 'Atual'}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 border-b mb-4">
            <CardTitle className="text-lg">Experiência</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="h-8">
              <Pencil className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {values.experiences.map((exp, i) => (
              <div key={i} className="text-sm">
                <p className="font-bold text-base">{exp.cargo}</p>
                <p className="text-muted-foreground text-base">{exp.empresa}</p>
                <p className="text-sm text-muted-foreground mb-2 mt-1">
                  {exp.data_inicio} até {exp.data_fim || 'Atual'}
                </p>
                {exp.descricao && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{exp.descricao}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg text-primary">Resumo DISC</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(3)}
            className="h-8 hover:bg-primary/10"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-lg">
            Seu perfil: <span className="text-primary">{discResult.tipoPerfil}</span>
          </p>
          <p className="text-muted-foreground text-base mt-1">{discResult.desc}</p>
        </CardContent>
      </Card>

      <div className="bg-muted/50 p-6 rounded-lg border space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="lgpd"
            checked={lgpd}
            onCheckedChange={(checked) =>
              setValue('lgpd', checked === true, { shouldValidate: true })
            }
            className="mt-1"
          />
          <Label htmlFor="lgpd" className="text-sm leading-relaxed cursor-pointer font-medium">
            Confirmo que as informações prestadas são verdadeiras e aceito que meus dados sejam
            processados de acordo com a Lei Geral de Proteção de Dados (LGPD) para fins de
            recrutamento e seleção.
          </Label>
        </div>
        {errors.lgpd && (
          <p className="text-sm text-destructive font-medium pl-7">{errors.lgpd.message}</p>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Atenção</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setCurrentStep(3)}
          disabled={isGenerating || isSending}
        >
          Voltar para Teste DISC
        </Button>
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!lgpd || isSending}
          className="min-w-[240px]"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando currículo...
            </>
          ) : (
            'Gerar e Enviar Currículo'
          )}
        </Button>
      </div>
    </div>
  )
}
