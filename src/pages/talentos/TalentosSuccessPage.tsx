import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle2,
  Download,
  FileText,
  ArrowRight,
  Award,
  Briefcase,
  RefreshCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function TalentosSuccessPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [expired, setExpired] = useState(false)
  const [profile, setProfile] = useState<{ type: string; desc: string } | null>(null)

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
        })
      } else {
        setProfile(scores[0])
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
    <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in-up">
      <title>Currículo Enviado - Super Era Digital</title>
      <meta property="og:title" content="Currículo Enviado - Super Era Digital" />
      <meta
        property="og:description"
        content="Meu currículo foi enviado com sucesso e já está em análise!"
      />
      <meta property="og:type" content="website" />

      <div className="text-center mb-10">
        <style>{`
          @keyframes checkmark {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
        <div
          className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
          style={{ animation: 'checkmark 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
        >
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Seu Currículo foi Criado com Sucesso!</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Enviamos seu currículo para{' '}
          <span className="font-medium text-foreground">comercial@areradigital.com.br</span>. Em
          breve, entraremos em contato.
        </p>
      </div>

      <Card className="mb-8 overflow-hidden border-primary/10 shadow-lg">
        <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg text-primary">Resumo do Currículo</h2>
        </div>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome Completo</p>
                <p className="font-medium">{data.personal.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="font-medium">{data.personal.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{data.personal.telefone}</p>
              </div>
            </div>

            <div className="bg-muted/50 p-5 rounded-xl border border-border/50">
              <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                Resultado DISC
              </h3>
              <p className="font-bold text-xl text-primary mb-2">{profile.type}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.desc}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Button size="lg" onClick={handleDownload} className="w-full sm:w-auto text-base h-12 px-8">
          <Download className="w-5 h-5 mr-2" />
          Baixar Currículo
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleCreateNew}
          className="w-full sm:w-auto text-base h-12 px-8"
        >
          <RefreshCcw className="w-5 h-5 mr-2" />
          Criar Novo
        </Button>
      </div>

      <div className="border-t pt-10">
        <h3 className="text-center font-semibold mb-6 text-muted-foreground">Próximos Passos</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/certificados" className="group">
            <Card className="h-full transition-all duration-200 hover:border-primary hover:shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      Explorar Certificados
                    </p>
                    <p className="text-sm text-muted-foreground">Emita seus certificados</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/erp" className="group">
            <Card className="h-full transition-all duration-200 hover:border-primary hover:shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      Conhecer o ERP
                    </p>
                    <p className="text-sm text-muted-foreground">Sistema de gestão integrado</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
