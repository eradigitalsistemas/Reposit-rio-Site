import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Activity } from 'lucide-react'

interface DISCScore {
  type: string
  value: number
}

interface DISCResultCardProps {
  tipo: string
  descricao: string
  pontuacoes?: DISCScore[]
}

export function DISCResultCard({ tipo, descricao, pontuacoes }: DISCResultCardProps) {
  return (
    <Card className="h-full overflow-hidden border-secondary/20 shadow-sm transition-all hover:shadow-md">
      <div className="bg-secondary/10 px-6 py-4 border-b border-secondary/20 flex items-center gap-3">
        <Activity className="w-5 h-5 text-secondary-foreground" />
        <h3 className="font-semibold text-lg text-secondary-foreground">Resultado DISC</h3>
      </div>
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="font-bold text-2xl text-secondary-foreground mb-2">{tipo}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{descricao}</p>
        </div>

        {pontuacoes && pontuacoes.length > 0 && (
          <div className="space-y-4 mt-6 pt-6 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Análise de Pontuações
            </p>
            <div className="space-y-3">
              {pontuacoes.map((s, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{s.type}</span>
                    <span className="font-bold text-muted-foreground">{s.value}/12</span>
                  </div>
                  <Progress value={(s.value / 12) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
