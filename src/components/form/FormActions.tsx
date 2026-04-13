import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2, Send } from 'lucide-react'

interface FormActionsProps {
  onBack?: () => void
  onNext?: () => void
  onSubmit?: () => void
  canGoBack?: boolean
  canGoNext?: boolean
  isLoading?: boolean
  isLastStep?: boolean
}

export function FormActions({
  onBack,
  onNext,
  onSubmit,
  canGoBack = true,
  canGoNext = true,
  isLoading = false,
  isLastStep = false,
}: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8 pt-6 border-t border-border">
      <div className="w-full sm:w-auto">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={!canGoBack || isLoading}
            className="w-full sm:w-auto min-w-[120px]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        )}
      </div>

      <div className="w-full sm:w-auto">
        {isLastStep ? (
          <Button
            type={onSubmit ? 'button' : 'submit'}
            onClick={onSubmit}
            disabled={!canGoNext || isLoading}
            className="w-full sm:w-auto min-w-[140px]"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Processando...' : 'Enviar'}
          </Button>
        ) : (
          onNext && (
            <Button
              type="button"
              onClick={onNext}
              disabled={!canGoNext || isLoading}
              className="w-full sm:w-auto min-w-[120px]"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!isLoading && 'Próximo'}
              {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          )
        )}
      </div>
    </div>
  )
}
