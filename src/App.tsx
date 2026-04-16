import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Layout from './components/Layout'
import Index from './pages/Index'
import Certificados from './pages/Certificados'
import ERP from './pages/ERP'
import FAQ from './pages/FAQ'
import BaseConhecimento from './pages/BaseConhecimento'
import Tecnologia from './pages/Tecnologia'
import TalentosPage from './pages/talentos/TalentosPage'
import TalentosSuccessPage from './pages/talentos/TalentosSuccessPage'
import DesignSystem from './pages/DesignSystem'
import IntegrationsDashboard from './pages/admin/IntegrationsDashboard'
import AdminTalentosPage from './pages/admin/AdminTalentosPage'
import AdminLogin from './pages/admin/AdminLogin'
import NotFound from './pages/NotFound'
import Politicas from './pages/Politicas'
import Termos from './pages/Termos'
import PortalParceiro from './pages/PortalParceiro'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/certificados" element={<Certificados />} />
            <Route path="/erp" element={<ERP />} />
            <Route path="/parceiros" element={<PortalParceiro />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/base-conhecimento" element={<BaseConhecimento />} />
            <Route path="/tecnologia" element={<Tecnologia />} />
            <Route path="/talentos" element={<TalentosPage />} />
            <Route path="/talentos/sucesso" element={<TalentosSuccessPage />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/integracoes"
              element={
                <ProtectedRoute>
                  <IntegrationsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/talentos"
              element={
                <ProtectedRoute>
                  <AdminTalentosPage />
                </ProtectedRoute>
              }
            />
            <Route path="/politicas" element={<Politicas />} />
            <Route path="/termos" element={<Termos />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
