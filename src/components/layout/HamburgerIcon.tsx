import { cn } from '@/lib/utils'

interface HamburgerIconProps {
  isOpen: boolean
  onClick: () => void
}

export function HamburgerIcon({ isOpen, onClick }: HamburgerIconProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md bg-transparent border-none cursor-pointer"
      aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      aria-expanded={isOpen}
    >
      <span
        className={cn(
          'block w-6 h-0.5 bg-foreground transition-transform duration-300 ease-in-out origin-center',
          isOpen ? 'translate-y-2 rotate-45' : '',
        )}
      />
      <span
        className={cn(
          'block w-6 h-0.5 bg-foreground transition-opacity duration-300 ease-in-out',
          isOpen ? 'opacity-0' : 'opacity-100',
        )}
      />
      <span
        className={cn(
          'block w-6 h-0.5 bg-foreground transition-transform duration-300 ease-in-out origin-center',
          isOpen ? '-translate-y-2 -rotate-45' : '',
        )}
      />
    </button>
  )
}
