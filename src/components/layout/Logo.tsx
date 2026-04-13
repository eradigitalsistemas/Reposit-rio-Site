import { Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LogoProps {
  onClick?: () => void
}

export function Logo({ onClick }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      aria-label="Era Digital Home"
    >
      <div className="bg-primary p-2 rounded-lg group-hover:bg-secondary transition-colors duration-300">
        <Zap className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="font-bold text-xl tracking-tight text-foreground">Era Digital</span>
    </Link>
  )
}
