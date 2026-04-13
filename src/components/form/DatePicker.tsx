import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

export function DatePicker({ label, error, hint, required, className, ...props }: DatePickerProps) {
  return (
    <div className="space-y-2 w-full relative">
      {label && (
        <Label className={cn('font-medium flex items-center', error && 'text-destructive')}>
          {label}
          {required && <span className="text-destructive ml-1.5">*</span>}
        </Label>
      )}
      <Input
        type="date"
        className={cn(
          'w-full transition-colors',
          error && 'border-destructive focus-visible:ring-destructive',
          className,
        )}
        {...props}
      />
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
