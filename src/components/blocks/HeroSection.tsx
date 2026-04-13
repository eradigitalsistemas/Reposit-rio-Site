import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface HeroSectionProps {
  title: ReactNode
  subtitle: string
  cta?: string
  onCTA?: () => void
  ctaIcon?: ReactNode
  ctaClassName?: string
  imageSrc?: string
}

export function HeroSection({
  title,
  subtitle,
  cta,
  onCTA,
  ctaIcon,
  ctaClassName,
  imageSrc,
}: HeroSectionProps) {
  const alignClass = imageSrc ? 'text-center md:text-left' : 'text-center'
  const flexClass = imageSrc ? 'flex flex-col md:flex-row' : 'flex flex-col'

  return (
    <section className={`${flexClass} items-center gap-10 pt-8 animate-slide-up`}>
      <div className={`flex-1 space-y-6 max-w-4xl mx-auto w-full ${alignClass}`}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0">
          {subtitle}
        </p>
        {cta && onCTA && (
          <div
            className={`flex pt-4 ${imageSrc ? 'justify-center md:justify-start' : 'justify-center'}`}
          >
            <Button size="lg" className={cn('text-lg px-8', ctaClassName)} onClick={onCTA}>
              {ctaIcon && <span className="mr-2 flex items-center">{ctaIcon}</span>}
              {cta}
            </Button>
          </div>
        )}
      </div>
      {imageSrc && (
        <div className="flex-1 w-full max-w-md mx-auto relative animate-fade-in">
          <div className="aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-2xl relative z-10 group">
            <img
              src={imageSrc}
              alt="Hero"
              className="object-cover w-full h-full grayscale opacity-90 group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-primary/30 mix-blend-multiply pointer-events-none transition-opacity duration-700 group-hover:opacity-0"></div>
          </div>
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl -z-10"></div>
        </div>
      )}
    </section>
  )
}
