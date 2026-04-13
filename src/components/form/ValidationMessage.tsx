import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ValidationMessageProps {
  type: 'error' | 'success' | 'info' | 'warning'
  message: string
  className?: string
}

export function ValidationMessage({ type, message, className }: ValidationMessageProps) {
  const iconMap = {
    error: <AlertCircle className="w-4 h-4 shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 shrink-0" />,
    info: <Info className="w-4 h-4 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 shrink-0" />,
  }

  const colorMap = {
    error: 'text-destructive bg-destructive/10 border-destructive/20',
    success:
      'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/20 dark:border-green-900',
    info: 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-900',
    warning:
      'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-900',
  }

  if (!message) return null

  return (
    <div
      className={cn(
        'flex items-start gap-2 p-3 text-sm rounded-md border animate-fade-in',
        colorMap[type],
        className,
      )}
    >
      <div className="mt-0.5">{iconMap[type]}</div>
      <span className="font-medium leading-relaxed">{message}</span>
    </div>
  )
}
