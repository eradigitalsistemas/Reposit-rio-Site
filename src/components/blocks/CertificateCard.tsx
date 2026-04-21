import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export interface CertificateCardProps {
  type: string
  description: string
  benefits: string[]
  onAction: () => void
}

export function CertificateCard({ type, description, benefits, onAction }: CertificateCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full border-primary/10">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-primary">{type}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-6">
        {description && <p className="text-sm text-muted-foreground text-center">{description}</p>}
        <ul className="space-y-2 flex-1">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start space-x-2 text-sm">
              <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full" variant="outline" onClick={onAction}>
          <span>Solicitar {type}</span>
        </Button>
      </CardContent>
    </Card>
  )
}
