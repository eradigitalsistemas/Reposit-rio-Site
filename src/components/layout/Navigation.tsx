import { NavLink } from './NavLink'

interface NavItem {
  label: string
  href: string
}

interface NavigationProps {
  items: NavItem[]
  currentPage: string
}

export function Navigation({ items, currentPage }: NavigationProps) {
  return (
    <nav className="hidden md:flex items-center gap-1 lg:gap-3" aria-label="Navegação Principal">
      {items.map((item) => {
        const isActive = item.href === '/' ? currentPage === '/' : currentPage.startsWith(item.href)

        return <NavLink key={item.href} label={item.label} href={item.href} isActive={isActive} />
      })}
    </nav>
  )
}
