import { Button } from '@/components/ui/button'
import { Download, RefreshCcw, Award } from 'lucide-react'

interface ActionButtonsProps {
  onDownload: () => void
  onNewCurriculum: () => void
  onExplore: () => void
}

export function ActionButtons({ onDownload, onNewCurriculum, onExplore }: ActionButtonsProps) {
  return (
    <div
      className="flex flex-col sm:flex-row gap-4 justify-center my-10 animate-fade-in-up"
      style={{ animationDelay: '200ms', animationFillMode: 'both' }}
    >
      <Button
        size="lg"
        onClick={onDownload}
        className="w-full sm:w-auto text-base h-12 px-8 shadow-md hover:shadow-lg transition-all"
      >
        <Download className="w-5 h-5 mr-2" />
        Baixar Currículo
      </Button>

      <Button
        size="lg"
        variant="secondary"
        onClick={onNewCurriculum}
        className="w-full sm:w-auto text-base h-12 px-8"
      >
        <RefreshCcw className="w-5 h-5 mr-2" />
        Criar Novo
      </Button>

      <Button
        size="lg"
        variant="ghost"
        onClick={onExplore}
        className="w-full sm:w-auto text-base h-12 px-8 border border-transparent hover:border-border"
      >
        <Award className="w-5 h-5 mr-2" />
        Explorar Certificados
      </Button>
    </div>
  )
}
