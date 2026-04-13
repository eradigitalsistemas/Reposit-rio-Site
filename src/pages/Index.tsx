import { Link, useNavigate } from 'react-router-dom'
import {
  FileBadge,
  Briefcase,
  Users,
  ArrowRight,
  Zap,
  Shield,
  Headphones,
  Rocket,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BenefitsSection } from '@/components/blocks/BenefitsSection'
import { CTASection } from '@/components/blocks/CTASection'

const Index = () => {
  const navigate = useNavigate()
  return (
    <div className="space-y-24 pb-10">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-10 pt-10 animate-slide-up">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
            Transforme o futuro da sua empresa com a{' '}
            <span className="text-secondary">Super Era Digital</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0">
            Sistemas ERP inteligentes, certificados digitais seguros e um portal exclusivo de
            talentos para alavancar seus negócios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/talentos">Crie seu Currículo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/erp">Conhecer Soluções</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full max-w-md mx-auto relative animate-fade-in">
          <div className="aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-2xl relative z-10">
            <img
              src="https://img.usecurling.com/p/800/800?q=digital%20business&color=blue"
              alt="Business Technology"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
        </div>
      </section>

      {/* Highlights */}
      <section className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nossas Soluções</h2>
          <p className="text-muted-foreground mt-2">
            Escolha a plataforma ideal para sua necessidade
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/certificados" className="block group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-secondary/50 group-hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <FileBadge className="h-6 w-6" />
                </div>
                <CardTitle className="group-hover:text-secondary transition-colors">
                  Certificados Digitais
                </CardTitle>
                <CardDescription>
                  Emissão rápida e validada de e-CPF, e-CNPJ e mais para sua segurança digital.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-secondary">
                  Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/erp" className="block group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-secondary/50 group-hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <CardTitle className="group-hover:text-secondary transition-colors">
                  Sistemas ERP
                </CardTitle>
                <CardDescription>
                  Gestão integrada, redução de custos e tomada de decisão baseada em dados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-secondary">
                  Conheça o ERP <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/talentos" className="block group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-secondary/50 group-hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="group-hover:text-secondary transition-colors">
                  Banco de Talentos
                </CardTitle>
                <CardDescription>
                  Cadastre seu currículo, realize nossa análise DISC e conecte-se com oportunidades.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-secondary">
                  Acessar portal <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 rounded-3xl p-8 md:p-12 space-y-8 animate-fade-in">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Por que escolher a Era Digital?</h2>
        </div>
        <BenefitsSection
          columns={4}
          benefits={[
            {
              icon: <Zap className="h-6 w-6" />,
              title: 'Agilidade',
              description: 'Processos otimizados e sem burocracia.',
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: 'Segurança',
              description: 'Conformidade total com a LGPD.',
            },
            {
              icon: <Headphones className="h-6 w-6" />,
              title: 'Suporte',
              description: 'Atendimento humanizado e rápido.',
            },
            {
              icon: <Rocket className="h-6 w-6" />,
              title: 'Inovação',
              description: 'Tecnologia de ponta atualizada.',
            },
          ]}
        />
      </section>

      {/* Final CTA */}
      <CTASection
        title="Pronto para começar?"
        description="Junte-se a centenas de empresas e profissionais que já transformaram seus resultados com nossas soluções."
        buttonText="Entenda nossa tecnologia"
        onCTA={() => navigate('/tecnologia')}
        variant="secondary"
      />
    </div>
  )
}

export default Index
