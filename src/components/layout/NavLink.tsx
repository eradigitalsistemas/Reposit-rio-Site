import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  label: string
  href: string
  isActive: boolean
  onClick?: () => void
  className?: string
}

export function NavLink({ label, href, isActive, onClick, className }: NavLinkProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        'text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-3 py-2',
        isActive
          ? 'text-primary font-semibold bg-primary/5'
          : 'text-muted-foreground hover:text-primary hover:bg-muted/50',
        className,
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}
