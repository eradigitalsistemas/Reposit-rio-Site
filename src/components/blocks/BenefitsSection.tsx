import { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export interface BenefitItem {
  icon: ReactNode
  title: string
  description: string
}

export interface BenefitsSectionProps {
  benefits: BenefitItem[]
  columns?: 2 | 3 | 4
}

export function BenefitsSection({ benefits, columns = 3 }: BenefitsSectionProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid grid-cols-1 gap-6 ${gridCols[columns]}`}>
      {benefits.map((benefit, i) => (
        <Card key={i} className="border-none shadow-none bg-transparent">
          <CardHeader className="items-center text-center pb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
              {benefit.icon}
            </div>
            <CardTitle className="text-xl">{benefit.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>{benefit.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
