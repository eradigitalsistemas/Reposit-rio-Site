import { Outlet, Link } from 'react-router-dom'
import { Zap, MapPin, Phone, Mail, Instagram } from 'lucide-react'
import { Header } from '@/components/layout/Header'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8 animate-fade-in-up">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/20 pt-16 pb-8 mt-auto">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand & Address */}
            <div className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2" aria-label="Era Digital Home">
                <div className="bg-primary p-1.5 rounded-lg">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg tracking-tight">Era Digital</span>
              </Link>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xs">
                Transformando processos gerenciais com tecnologia, eficiência e inovação para o seu
                negócio.
              </p>
              <div className="flex items-start gap-3 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>
                  Rua Fernando Drumont, 815
                  <br />
                  Centro, Floriano/PI
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground tracking-tight">Nossas Soluções</h3>
              <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
                <Link
                  to="/certificados"
                  className="hover:text-primary transition-colors focus-visible:text-primary outline-none"
                >
                  Certificados Digitais
                </Link>
                <Link
                  to="/erp"
                  className="hover:text-primary transition-colors focus-visible:text-primary outline-none"
                >
                  Sistemas ERP
                </Link>
                <Link
                  to="/talentos"
                  className="hover:text-primary transition-colors focus-visible:text-primary outline-none"
                >
                  Banco de Talentos
                </Link>
                <Link
                  to="/base-conhecimento"
                  className="hover:text-primary transition-colors focus-visible:text-primary outline-none"
                >
                  Base de Conhecimento
                </Link>
                <Link
                  to="/faq"
                  className="hover:text-primary transition-colors focus-visible:text-primary outline-none"
                >
                  Perguntas Frequentes
                </Link>
              </nav>
            </div>

            {/* Contacts */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground tracking-tight">Fale Conosco</h3>
              <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
                <a
                  href="https://wa.me/5589999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors focus-visible:text-primary outline-none"
                >
                  <Phone className="h-4 w-4" />
                  <span>WhatsApp Comercial</span>
                </a>
                <a
                  href="https://wa.me/5589999999998"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors focus-visible:text-primary outline-none"
                >
                  <Phone className="h-4 w-4" />
                  <span>WhatsApp Suporte</span>
                </a>
                <a
                  href="mailto:comercial@areradigital.com.br"
                  className="flex items-center gap-2 hover:text-primary transition-colors focus-visible:text-primary outline-none"
                >
                  <Mail className="h-4 w-4" />
                  <span className="truncate">comercial@areradigital.com.br</span>
                </a>
              </nav>
            </div>

            {/* Social & Legal */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground tracking-tight">Redes Sociais</h3>
              <a
                href="https://instagram.com/eradigitalsistemas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:text-primary outline-none"
              >
                <Instagram className="h-4 w-4" />
                <span>@eradigitalsistemas</span>
              </a>

              <h3 className="font-semibold text-foreground mt-4 tracking-tight">Legal</h3>
              <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
                <Link
                  to="#"
                  className="hover:text-primary transition-colors focus-visible:text-primary outline-none"
                >
                  Políticas de Privacidade
                </Link>
                <Link
                  to="#"
                  className="hover:text-primary transition-colors focus-visible:text-primary outline-none"
                >
                  Termos de Uso
                </Link>
              </nav>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-sm text-muted-foreground">
            <p>&copy; 2024 Era Digital. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1.5 justify-center">
              Protegido e em conformidade com a LGPD.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
