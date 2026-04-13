import { Link } from 'react-router-dom'
import { FileBadge, Briefcase, Users, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const Index = () => {
  return (
    <div className="space-y-12 pb-10">
      <section className="text-center space-y-4 pt-10 pb-6 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Bem-vindo à <span className="text-secondary">Super Era Digital</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Simplificamos a captura de oportunidades e talentos. Escolha um dos fluxos abaixo para
          iniciar seu cadastro em nossa plataforma de forma segura e ágil.
        </p>
      </section>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in"
        style={{ animationDelay: '0.1s' }}
      >
        <Link to="/certificados" className="block group">
          <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-secondary/50 group-hover:-translate-y-1">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <FileBadge className="h-6 w-6" />
              </div>
              <CardTitle className="group-hover:text-secondary transition-colors">
                Quero meu Certificado
              </CardTitle>
              <CardDescription>
                Solicite e emita certificados digitais de forma rápida e validada para seus cursos e
                treinamentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm font-medium text-secondary">
                Acessar formulário <ArrowRight className="ml-2 h-4 w-4" />
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
                Soluções ERP
              </CardTitle>
              <CardDescription>
                Descubra como nosso sistema ERP pode transformar a gestão da sua empresa com
                inteligência e integração.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm font-medium text-secondary">
                Tenho interesse <ArrowRight className="ml-2 h-4 w-4" />
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
                Cadastre seu currículo, realize nossa análise DISC e conecte-se com as melhores
                oportunidades do mercado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm font-medium text-secondary">
                Cadastrar perfil <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default Index
