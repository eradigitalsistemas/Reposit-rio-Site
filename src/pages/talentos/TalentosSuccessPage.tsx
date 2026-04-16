import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  FileText,
  RefreshCcw,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Download,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const generateAbntResumeHtml = (resumeData: any, userProfile: any) => {
  const { personal, educations = [], experiences = [], additional_info = {} } = resumeData

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Atual'
    const d = new Date(dateStr)
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR', {
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatText = (text: string) => {
    if (!text) return ''
    return text.replace(/\\n/g, '<br/>')
  }

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Currículo - ${personal.nome}</title>
      <style>
        @page {
          size: A4;
          margin: 3cm 2cm 2cm 3cm;
        }
        body {
          font-family: "Arial", "Times New Roman", sans-serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #000;
          margin: 0;
          padding: 0;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          font-size: 14pt;
          font-weight: bold;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 24pt;
        }
        h2 {
          font-size: 14pt;
          font-weight: bold;
          text-transform: uppercase;
          margin-top: 18pt;
          margin-bottom: 12pt;
        }
        p {
          margin: 0 0 12pt 0;
          text-align: justify;
        }
        .header-info {
          text-align: center;
          margin-bottom: 24pt;
        }
        .header-info p {
          margin: 0;
          text-align: center;
        }
        .section-item {
          margin-bottom: 12pt;
        }
        .item-title {
          font-weight: bold;
        }
        .item-date {
          font-style: italic;
        }
        .profile-desc {
          margin-top: 6pt;
          display: block;
        }
        ul {
          margin: 0 0 12pt 0;
          padding-left: 24pt;
        }
        li {
          margin-bottom: 6pt;
          text-align: justify;
        }
        @media print {
          body { max-width: none; margin: 0; }
        }
      </style>
    </head>
    <body>
      <h1>${personal.nome}</h1>
      
      <div class="header-info">
        <p>${personal.endereco || 'Endereço não informado'}</p>
        <p>Telefone: ${personal.telefone} | E-mail: ${personal.email}</p>
        ${personal.data_nascimento ? `<p>Data de Nascimento: ${new Date(personal.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR')}</p>` : ''}
      </div>

      <h2>RESUMO PROFISSIONAL</h2>
      <p>${additional_info.resumo_profissional ? formatText(additional_info.resumo_profissional) : 'Não informado.'}</p>

      <h2>FORMAÇÃO ACADÊMICA</h2>
      ${
        educations.length > 0
          ? educations
              .map(
                (ed: any) => `
        <div class="section-item">
          <p>
            <span class="item-title">${ed.curso}</span><br/>
            ${ed.instituicao} <br/>
            <span class="item-date">${formatDate(ed.data_inicio)} a ${formatDate(ed.data_fim)}</span>
          </p>
        </div>
      `,
              )
              .join('')
          : '<p>Não informada.</p>'
      }

      <h2>EXPERIÊNCIA PROFISSIONAL</h2>
      ${
        experiences.length > 0
          ? experiences
              .map(
                (exp: any) => `
        <div class="section-item">
          <p>
            <span class="item-title">${exp.cargo}</span> - ${exp.empresa}<br/>
            <span class="item-date">${formatDate(exp.data_inicio)} a ${formatDate(exp.data_fim)}</span><br/>
            ${exp.descricao ? formatText(exp.descricao) : ''}
          </p>
        </div>
      `,
              )
              .join('')
          : '<p>Não informada.</p>'
      }

      <h2>HABILIDADES E COMPETÊNCIAS</h2>
      <p>
        <strong>Soft Skills (Comportamentais):</strong><br/>
        ${additional_info.soft_skills ? formatText(additional_info.soft_skills) : 'Não informadas.'}
      </p>
      <p>
        <strong>Hard Skills (Técnicas):</strong><br/>
        ${additional_info.hard_skills ? formatText(additional_info.hard_skills) : 'Não informadas.'}
      </p>

      <h2>CURSOS ADICIONAIS E IDIOMAS</h2>
      <p>
        <strong>Cursos Adicionais:</strong><br/>
        ${additional_info.cursos_adicionais ? formatText(additional_info.cursos_adicionais) : 'Não informados.'}
      </p>
      <p>
        <strong>Idiomas:</strong><br/>
        ${additional_info.idiomas ? formatText(additional_info.idiomas) : 'Não informados.'}
      </p>
    </body>
    </html>
  `
}

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
    if (!data || !profile) return
    const htmlContent = generateAbntResumeHtml(data, profile)
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Curriculo_${data?.personal?.nome?.replace(/\s+/g, '_')}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

      <div className="text-center mb-12">
        <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Seu Currículo foi Adicionado ao Banco de Talentos!
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Seu perfil já está disponível para nossa equipe de recrutamento. Você também pode baixar o
          arquivo no formato Word abaixo.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3 border-b mb-4">
            <CardTitle className="text-lg flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" /> Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              {data.personal.foto_url ? (
                <img
                  src={data.personal.foto_url}
                  alt="Foto de perfil"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-bold text-lg">{data.personal.nome}</p>
                <p className="text-sm text-muted-foreground">{data.personal.email}</p>
                <p className="text-sm text-muted-foreground">{data.personal.telefone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3 border-b border-primary/10 mb-4">
            <CardTitle className="text-lg flex items-center text-primary">
              <FileText className="w-5 h-5 mr-2" /> Seu Perfil DISC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-xl mb-2">{profile.type}</p>
            <p className="text-muted-foreground">{profile.desc}</p>
            <div className="mt-4 space-y-2">
              {profile.scores?.map((s, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="font-medium">{s.type}</span>
                  <span className="text-primary font-bold">{s.value} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Button size="lg" onClick={handleDownload} className="min-w-[200px] text-base">
          <Download className="w-5 h-5 mr-2" /> Baixar Currículo (.doc)
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleCreateNew}
          className="min-w-[200px] text-base"
        >
          <RefreshCcw className="w-5 h-5 mr-2" /> Gerar Novo
        </Button>
      </div>

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
