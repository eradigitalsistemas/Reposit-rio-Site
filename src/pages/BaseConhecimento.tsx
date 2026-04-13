import { useState } from 'react'
import { BookOpen, Video, FileText, Send, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function BaseConhecimento() {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    toast({
      title: 'Inscrição confirmada!',
      description: 'Você receberá novidades assim que a base de conhecimento for lançada.',
    })
    setEmail('')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-10 animate-fade-in">
      <div className="text-center space-y-6">
        <div className="inline-flex px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
          <Sparkles className="inline-block mr-2 h-4 w-4" />
          Em Breve
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Base de Conhecimento
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Estamos preparando um portal exclusivo repleto de materiais educacionais para impulsionar
          a sua carreira e o seu negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-70">
        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <Video className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <CardTitle>Cursos e Treinamentos</CardTitle>
            <CardDescription>
              Aprenda a extrair o máximo do nosso ERP com videoaulas práticas.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <CardTitle>Manuais do Usuário</CardTitle>
            <CardDescription>
              Documentação técnica detalhada sobre todas as nossas ferramentas.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <CardTitle>Artigos e Dicas</CardTitle>
            <CardDescription>
              Melhores práticas de gestão, produtividade e tendências de tecnologia.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-primary text-primary-foreground max-w-2xl mx-auto overflow-hidden">
        <CardContent className="p-8 md:p-12 text-center space-y-6">
          <h2 className="text-2xl font-bold">Seja o primeiro a acessar!</h2>
          <p className="text-primary-foreground/80">
            Inscreva-se em nossa newsletter para receber uma notificação exclusiva quando o conteúdo
            estiver disponível.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-12"
            />
            <Button type="submit" variant="secondary" className="h-12 px-8">
              <Send className="mr-2 h-4 w-4" /> Assinar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
