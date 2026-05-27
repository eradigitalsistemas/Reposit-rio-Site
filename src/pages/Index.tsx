import { useNavigate } from 'react-router-dom'
import { HeroSection } from '@/components/blocks/HeroSection'
import { Button } from '@/components/ui/button'
import { ShieldCheck, FileCheck, Users, ArrowRight } from 'lucide-react'

export default function Index() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-24">
          <HeroSection
            title={
              <>
                Era Digital <span className="text-blue-600">Web</span>
              </>
            }
            subtitle="Plataforma integrada para gestão de talentos, emissão de certificados e compliance corporativo (NR-1)."
            cta="Conhecer Soluções"
            onCTA={() => navigate('/talentos')}
            ctaIcon={<ArrowRight className="w-5 h-5" />}
            imageSrc="https://img.usecurling.com/p/800/800?q=digital%20business&color=blue&dpr=2"
          />
        </div>

        {/* Features Section */}
        <section className="bg-muted/30 py-20 border-y">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Soluções Corporativas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ferramentas especializadas para otimizar processos e garantir conformidade na sua
                empresa.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Certificados</h3>
                <p className="text-muted-foreground mb-6">
                  Emissão e validação de certificados digitais com segurança e agilidade.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/certificados')}
                  className="w-full"
                >
                  Saiba mais
                </Button>
              </div>
              <div className="bg-card p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Banco de Talentos</h3>
                <p className="text-muted-foreground mb-6">
                  Captação de currículos e análise de perfil comportamental (DISC).
                </p>
                <Button variant="outline" onClick={() => navigate('/talentos')} className="w-full">
                  Saiba mais
                </Button>
              </div>
              <div className="bg-card p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Compliance NR-1</h3>
                <p className="text-muted-foreground mb-6">
                  Avaliação psicossocial automatizada para gestão de riscos ocupacionais.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/talentos/avaliacao-psicossocial')}
                  className="w-full"
                >
                  Saiba mais
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* NR-1 CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Gerenciamento de Riscos Ocupacionais
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Em conformidade com a NR-1 (Portaria MTP nº 1.419/2024), disponibilizamos uma
              ferramenta completa de Avaliação Psicossocial. Identifique e previna riscos no
              ambiente de trabalho de forma estruturada e confidencial.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="px-8 text-lg w-full sm:w-auto"
                onClick={() => navigate('/talentos/avaliacao-psicossocial')}
              >
                Iniciar Avaliação NR-1
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
