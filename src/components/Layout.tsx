import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, Zap, MapPin, Phone, Mail, Instagram } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

export default function Layout() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  // Close sheet on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Certificados', path: '/certificados' },
    { name: 'ERP', path: '/erp' },
    { name: 'Currículo', path: '/talentos' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Base de Conhecimento', path: '/base-conhecimento' },
  ]

  const NavLinks = ({ mobile }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        // Only mark exact match for Home, else startsWith for active state (but exclude root logic for others)
        const isActive =
          item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)

        // Se for o link do currículo no mobile ou desktop (sem ser o botão CTA), a gente não mostra pra não duplicar,
        // porque a especificação pede 'Crie seu Currículo' como CTA primário.
        // O prompt fala: "Menu de navegação (desktop): Home, Certificados, ERP, Currículo, FAQ, Base de Conhecimento" e também "CTA primário: 'Crie seu Currículo' (botão destacado)".
        // Para seguir fielmente, vou manter todos.

        if (item.path === '/talentos') return null // Escondendo do menu padrão porque vai ser um CTA primário

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isActive ? 'text-primary font-semibold' : 'text-muted-foreground',
              mobile ? 'block py-2 text-base' : '',
            )}
          >
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full h-[80px] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm flex items-center transition-all duration-300">
        <div className="container max-w-[1200px] mx-auto flex w-full items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Era Digital Home">
            <div className="bg-primary p-2 rounded-lg group-hover:bg-secondary transition-colors duration-300">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">Era Digital</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
            <Button asChild className="ml-2 font-semibold shadow-md hover:shadow-lg transition-all">
              <Link to="/talentos">Crie seu Currículo</Link>
            </Button>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menu mobile">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-6 pt-12 w-[300px]">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <SheetDescription className="sr-only">
                  Links para navegar pelo site da Era Digital
                </SheetDescription>
                <nav className="flex flex-col gap-2">
                  <NavLinks mobile />
                </nav>
                <div className="mt-4 flex flex-col gap-4 border-t pt-6">
                  <Button asChild className="w-full font-semibold shadow-md">
                    <Link to="/talentos">Crie seu Currículo</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

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
