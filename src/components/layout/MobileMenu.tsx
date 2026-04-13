import { useEffect } from 'react'
import { NavLink } from './NavLink'
import { CTAButton } from './CTAButton'
import { HamburgerIcon } from './HamburgerIcon'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
}

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
  items: NavItem[]
  currentPage: string
}

export function MobileMenu({ isOpen, onToggle, items, currentPage }: MobileMenuProps) {
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onToggle])

  return (
    <div className="md:hidden flex items-center">
      <div className="relative z-[60]">
        <HamburgerIcon isOpen={isOpen} onClick={onToggle} />
      </div>

      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onToggle}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-[85%] max-w-[350px] bg-background border-l shadow-2xl pt-[80px] p-6 flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu Principal"
      >
        <nav className="flex flex-col gap-3 overflow-y-auto pb-4 mt-2">
          {items.map((item) => {
            const isActive =
              item.href === '/' ? currentPage === '/' : currentPage.startsWith(item.href)

            return (
              <NavLink
                key={item.href}
                label={item.label}
                href={item.href}
                isActive={isActive}
                onClick={onToggle}
                className="text-lg py-4 px-4 rounded-lg active:scale-95 transition-transform"
              />
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t pt-6 pb-8">
          <CTAButton text="Crie seu Currículo" onClick={onToggle} className="w-full py-6 text-lg" />
        </div>
      </div>
    </div>
  )
}
