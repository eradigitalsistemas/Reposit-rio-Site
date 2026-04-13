import { Link } from 'react-router-dom'
import { FileQuestion, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 animate-fade-in px-4">
      <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        <FileQuestion className="h-12 w-12" />
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Ops! O link que você tentou acessar parece estar quebrado ou a página foi movida para
          outro endereço.
        </p>
      </div>
      <div className="pt-6">
        <Button asChild size="lg" className="h-12 px-8 text-base">
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Voltar para a Home
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
