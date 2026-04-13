import { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface FieldWrapperProps {
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: ReactNode
  className?: string
}

export function FieldWrapper({
  label,
  error,
  required,
  hint,
  children,
  className,
}: FieldWrapperProps) {
  return (
    <div className={cn('space-y-2 w-full', className)}>
      <Label className={cn('font-medium flex items-center', error && 'text-destructive')}>
        {label}
        {required && <span className="text-destructive ml-1.5">*</span>}
      </Label>
      <div className="relative">{children}</div>
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs text-destructive flex items-start mt-1.5 font-medium animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
          <span className="leading-tight">{error}</span>
        </p>
      )}
    </div>
  )
}
