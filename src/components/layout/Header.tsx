import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Logo } from './Logo'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { CTAButton } from './CTAButton'
import { cn } from '@/lib/utils'

interface HeaderProps {
  currentPage?: string
  onNavigate?: (path: string) => void
}

export function Header({ currentPage: propCurrentPage, onNavigate }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const currentPage = propCurrentPage || location.pathname

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [currentPage])

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      navigate(path)
    }
  }

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Certificados', href: '/certificados' },
    { label: 'ERP', href: '/erp' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Base de Conhecimento', href: '/base-conhecimento' },
    { label: 'Área Restrita', href: '/admin/talentos' },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full h-[80px] transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm'
          : 'bg-background border-b border-transparent',
      )}
    >
      <div className="container max-w-[1200px] mx-auto flex h-full items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex-shrink-0 relative z-[60] py-2">
          <Logo
            onClick={() => {
              setIsOpen(false)
              handleNavigate('/')
            }}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <Navigation items={navItems} currentPage={currentPage} />
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center flex-shrink-0">
          <CTAButton text="Crie seu Currículo" onClick={() => handleNavigate('/talentos')} />
        </div>

        {/* Mobile Navigation */}
        <MobileMenu
          isOpen={isOpen}
          onToggle={toggleMenu}
          items={navItems}
          currentPage=