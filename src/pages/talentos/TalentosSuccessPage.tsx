import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FileText, RefreshCcw, ArrowRight, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SuccessAnimation } from '@/components/talentos/success/SuccessAnimation'
import { ConfirmationMessage } from '@/components/talentos/success/ConfirmationMessage'
import { ResumoCard } from '@/components/talentos/success/ResumoCard'
import { DISCResultCard } from '@/components/talentos/success/DISCResultCard'
import { ActionButtons } from '@/components/talentos/success/ActionButtons'

export default function TalentosSuccessPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [expired, setExpired] = useState(false)
  const [profile, setProfile] = useState<{ type: string; desc: string; scores?: any[] } | null>(
    null,
  )

  useEffect(() => {
    const saved = localStorage.getItem('talentos_form_data')
    const generatedAt = localStorage.getItem('talentos_generated_at')

    if (!saved) {
      navigate('/talentos', { replace: true })
      return
    }

    try {
      const parsed = JSON.parse(saved)
      setData(parsed)

      if (generatedAt) {
        const generatedTime = new Date(generatedAt).getTime()
        const now = new Date().getTime()
        if (now - generatedTime > 24 * 60 * 60 * 1000) {
          setExpired(true)
        }
      }

      const disc = parsed.disc || {}
      let scoreD = 0,
        scoreI = 0,
        scoreS = 0,
        scoreC = 0
      Object.values(disc).forEach((ans) => {
        if (ans === 'D') scoreD++
        if (ans === 'I') scoreI++
        if (ans === 'S') scoreS++
        if (ans === 'C') scoreC++
      })
      const scores = [
        {
          type: 'Dominância (D)',
          desc: 'Focado em resultados, direto e competitivo.',
          value: scoreD,
        },
        {
          type: 'Influência (I)',
          desc: 'Comunicativo, persuasivo e focado em pessoas.',
          value: scoreI,
        },
        {
          type: 'Estabilidade (S)',
          desc: 'Paciente, confiável e focado em equipe.',
          value: scoreS,
        },
        { type: 'Conformidade (C)', desc: 'Analítico, preciso e focado em regras.', value: scoreC },
      ]
      scores.sort((a, b) => b.value - a.value)

      if (scores[0].value === scores[1].value && scores[0].value > 0) {
        setProfile({
          type: `${scores[0].type.split(' ')[0]} / ${scores[1].type.split(' ')[0]}`,
          desc: 'Perfil equilibrado com múltiplas forças complementares.',
          scores: scores,
        })
      } else {
        setProfile({ ...scores[0], scores })
      }
    } catch (e) {
      navigate('/talentos', { replace: true })
    }
  }, [navigate])

  const handleDownload = () => {
    const pdfBase64 = localStorage.getItem('talentos_pdf_base64')
    if (pdfBase64) {
      const link = document.createElement('a')
      link.href = `data:application/pdf;base64,${pdfBase64}`
      link.download = `Curriculo_${data.personal.nome.replace(/\s+/g, '_')}.pdf`
      link.click()
    } else {
      const content = `Currículo de ${data?.personal?.nome}\nEmail: ${data?.personal?.email}\nTelefone: ${data?.personal?.telefone}\n\nPerfil DISC: ${profile?.type}\n${profile?.desc}`
      const blob = new Blob([content], { type: 'text/plain' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `Curriculo_${data?.personal?.nome?.replace(/\s+/g, '_')}.txt`
      link.click()
    }
  }

  const handleCreateNew = () => {
    localStorage.removeItem('talentos_form_data')
    localStorage.removeItem('talentos_pdf_base64')
    localStorage.removeItem('talentos_generated_at')
    navigate('/talentos')
  }

  if (expired) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-fade-in">
        <div className="bg-destructive/10 text-destructive w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Seu currículo expirou</h1>
        <p className="text-muted-foreground mb-8">
          Por motivos de segurança, o link para download do currículo expira após 24 horas. Você
          precisará gerar um novo currículo.
        </p>
        <Button onClick={handleCreateNew} size="lg">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Gerar Novo Currículo
        </Button>
      </div>
    )
  }

  if (!data || !profile) return null

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in-up">
      <title>Currículo Enviado - Super Era Digital</title>
      <meta property="og:title" content="Currículo Enviado - Super Era Digital" />
      <meta
        property="og:description"
        content="Meu currículo foi enviado com sucesso e já está em análise!"
      />
      <meta property="og:type" content="website" />

      <SuccessAnimation type="checkmark" />

      <ConfirmationMessage
        message="Seu Currículo foi Criado com Sucesso!"
        subMessage="Enviamos seu currículo para comercial@areradigital.com.br. Em breve, entraremos em contato."
      />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ResumoCard
          nome={data.personal.nome}
          email={data.personal.email}
          telefone={data.personal.telefone}
          foto={data.personal.foto_url}
        />

        <DISCResultCard tipo={profile.type} descricao={profile.desc} pontuacoes={profile.scores} />
      </div>

      <ActionButtons
        onDownload={handleDownload}
        onNewCurriculum={handleCreateNew}
        onExplore={() => navigate('/certificados')}
      />

      <div className="border-t pt-10">
        <h3 className="text-center font-semibold mb-6 text-muted-foreground">
          Conheça Nossas Soluções
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Link
            to="/erp"
            className="group block sm:col-span-2 md:col-span-1 md:col-start-2 lg:col-start-1 lg:col-span-2"
          >
            <Card className="h-full transition-all duration-200 hover:border-primary hover:shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg group-hover:text-primary transition-colors">
                      Conhecer o ERP
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sistema de gestão integrado da Super Era Digital
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
