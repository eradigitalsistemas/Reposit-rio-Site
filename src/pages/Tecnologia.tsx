import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Activity, LineChart, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Tecnologia() {
  return (
    <div className="space-y-20 pb-16 pt-8 animate-fade-in">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Tecnologia nos Processos Gerenciais
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Em um mercado dinâmico, a tecnologia não é apenas um diferencial competitivo, é a base
          para a sobrevivência e crescimento sustentável da sua empresa.
        </p>
      </section>

      {/* Main Image */}
      <section className="max-w-5xl mx-auto">
        <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-xl">
          <img
            src="https://img.usecurling.com/p/1200/500?q=data%20analysis&color=blue"
            alt="Análise de Dados e Tecnologia"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Por que automatizar?</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A automação de processos gerenciais reduz o tempo gasto em tarefas repetitivas, minimiza
            falhas humanas e libera sua equipe para focar em atividades estratégicas que realmente
            trazem valor ao negócio.
          </p>
          <ul className="space-y-4">
            {[
              'Integração total entre setores',
              'Visão holística do negócio',
              'Controle financeiro em tempo real',
              'Aumento da produtividade',
            ].map((item, i) => (
              <li key={i} className="flex items-center text-primary font-medium">
                <CheckCircle2 className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-slate-50 p-6 rounded-xl border flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Decisões Ágeis</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Dados precisos e atualizados permitem respostas rápidas às mudanças de mercado.
              </p>
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl border flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
              <LineChart className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Redução de Custos</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Identifique gargalos e evite desperdícios operacionais com análises preditivas.
              </p>
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl border flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Trabalho Remoto</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Sistemas em nuvem garantem acesso seguro e gestão eficiente de qualquer lugar do
                mundo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto bg-primary text-primary-foreground rounded-3xl p-10 text-center space-y-6 shadow-xl">
        <h2 className="text-3xl font-bold">Dê o próximo passo na transformação digital</h2>
        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
          Nossos sistemas ERP são projetados para trazer a eficiência da tecnologia de ponta
          diretamente para o dia a dia da sua gestão.
        </p>
        <Button size="lg" variant="secondary" className="mt-4 px-8 h-14 text-lg" asChild>
          <Link to="/erp">
            Conhecer nossas soluções ERP <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
