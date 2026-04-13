import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-principal-preto-sem-fundo-024c6.png'

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
      <img src={logoImg} alt="Era Digital" className="h-8 w-auto object-contain" />
      <span className="font-bold text-xl tracking-tight text-foreground">Era Digital</span>
    </Link>
  )
}
