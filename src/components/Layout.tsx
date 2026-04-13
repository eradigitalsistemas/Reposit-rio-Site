import { Outlet, Link } from 'react-router-dom'
import { Menu, Zap } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const NavLinks = () => (
    <>
      <Link
        to="/certificados"
        className="text-sm font-medium hover:text-secondary transition-colors"
      >
        Certificados
      </Link>
      <Link to="/erp" className="text-sm font-medium hover:text-secondary transition-colors">
        Sistemas ERP
      </Link>
      <Link to="/talentos" className="text-sm font-medium hover:text-secondary transition-colors">
        Talentos
      </Link>
      <Link to="/tecnologia" className="text-sm font-medium hover:text-secondary transition-colors">
        Tecnologia
      </Link>
      <Link
        to="/base-conhecimento"
        className="text-sm font-medium hover:text-secondary transition-colors"
      >
        Conteúdo
      </Link>
      <Link to="/faq" className="text-sm font-medium hover:text-secondary transition-colors">
        FAQ
      </Link>
    </>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container max-w-[1200px] flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg group-hover:bg-secondary transition-colors">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Super Era Digital</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-6 pt-12">
                <NavLinks />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8 animate-fade-in">
        <Outlet />
      </main>

      <footer className="border-t py-8 mt-auto bg-white">
        <div className="container max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Super Era Digital. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Protegido e em conformidade com a LGPD.</span>
            <Link to="#" className="hover:text-primary underline underline-offset-4">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
