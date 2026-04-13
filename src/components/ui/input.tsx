import * as React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<'input'> {
  label?: string
  error?: string | boolean
  success?: boolean
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, success, icon, required, disabled, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    const hasError = !!error

    const inputElement = (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-low ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:shadow-medium',
            icon && 'pl-10',
            hasError &&
              'border-destructive focus-visible:ring-destructive focus-visible:border-destructive',
            success &&
              'border-green-500 focus-visible:ring-green-500 focus-visible:border-green-500',
            className,
          )}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={hasError && typeof error === 'string' ? `${inputId}-error` : undefined}
          {...props}
        />
        {hasError && (
          <div className="absolute right-3 flex items-center justify-center text-destructive">
            <XCircle className="h-4 w-4" />
          </div>
        )}
        {success && !hasError && (
          <div className="absolute right-3 flex items-center justify-center text-green-500">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )}
      </div>
    )

    if (!label && typeof error !== 'string') {
      return inputElement
    }

    return (
      <div className="grid w-full items-center gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              hasError && 'text-destructive',
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        {inputElement}
        {typeof error === 'string' && (
          <p id={`${inputId}-error`} className="text-[0.8rem] font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
