import { Card, CardContent } from '@/components/ui/card'
import { FileText, User } from 'lucide-react'

interface ResumoCardProps {
  nome: string
  email: string
  telefone: string
  foto?: string
}

export function ResumoCard({ nome, email, telefone, foto }: ResumoCardProps) {
  return (
    <Card className="h-full overflow-hidden border-primary/10 shadow-sm transition-all hover:shadow-md">
      <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex items-center gap-3">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-lg text-primary">Resumo do Currículo</h2>
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {foto ? (
            <img
              src={foto}
              alt={nome}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border flex-shrink-0">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div className="space-y-4 flex-1">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Nome Completo
              </p>
              <p className="font-medium text-foreground">{nome}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                E-mail
              </p>
              <p className="font-medium text-foreground">{email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Telefone
              </p>
              <p className="font-medium text-foreground">{telefone}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
