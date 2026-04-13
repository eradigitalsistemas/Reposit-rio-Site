import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { SiteFooter } from '@/components/layout/Footer'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8 animate-fade-in-up">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  )
}
