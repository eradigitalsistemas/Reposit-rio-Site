import { Button } from '@/components/ui/button'

export interface CTASectionProps {
  title: string
  description: string
  buttonText: string
  onCTA: () => void
  variant?: 'primary' | 'secondary'
}

export function CTASection({
  title,
  description,
  buttonText,
  onCTA,
  variant = 'primary',
}: CTASectionProps) {
  return (
    <section
      className={`text-center space-y-6 max-w-3xl mx-auto py-12 px-6 rounded-3xl ${
        variant === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-secondary/10'
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      <p
        className={`text-lg ${variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
      >
        {description}
      </p>
      <Button
        size="lg"
        className="px-8 mt-4"
        variant={variant === 'primary' ? 'secondary' : 'default'}
        onClick={onCTA}
      >
        {buttonText}
      </Button>
    </section>
  )
}
