import { Button } from '@/components/ui/button'
import { RefreshCcw, Award, MailCheck } from 'lucide-react'

interface ActionButtonsProps {
  onDownload?: () => void
  onNewCurriculum: () => void
  onExplore: () => void
}

export function ActionButtons({ onNewCurriculum, onExplore }: ActionButtonsProps) {
  return (
    <div
      className="space-y-8 animate-fade-in-up"
      style={{ animationDelay: '200ms', animationFillMode: 'both' }}
    >
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-3 max-w-2xl mx-auto shadow-sm">
        <div className="bg-primary/10 p-3 rounded-full">
          <MailCheck className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm sm:text-base font-medium text-foreground">
          Seu currículo formatado em PDF (ABNT) foi enviado para o seu e-mail com sucesso!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={onNewCurriculum}
          className="w-full sm:w-auto text-base h-12 px-8 shadow-md hover:shadow-lg transition-all"
        >
          <RefreshCcw className="w-5 h-5 mr-2" />
          Criar Novo
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={onExplore}
          className="w-full sm:w-auto text-base h-12 px-8 border border-transparent hover:border-border"
        >
          <Award className="w-5 h-5 mr-2" />
          Explorar Certificados
        </Button>
      </div>
    </div>
  )
}
