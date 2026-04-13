import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface CTAButtonProps {
  text: string
  onClick?: () => void
  className?: string
}

export function CTAButton({ text, onClick, className }: CTAButtonProps) {
  return (
    <Button
      asChild
      className={cn('font-semibold shadow-md hover:shadow-lg transition-all', className)}
    >
      <Link to="/talentos" onClick={onClick} aria-label={text}>
        {text}
      </Link>
    </Button>
  )
}
