/* Toaster Component - A component that displays a toaster (a component that displays a toast) - from shadcn/ui (exposes Toaster) */
import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={5000}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const { variant } = props as any
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-3">
              {variant === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              )}
              {(variant === 'destructive' || variant === 'error') && (
                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              )}
              {variant === 'info' && <Info className="h-5 w-5 text-blue-500 shrink-0" />}
              {variant === 'warning' && (
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              )}

              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
