import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <Loader2
      className={cn(
        'animate-spin text-muted-foreground',
        {
          'h-5 w-5': size === 'sm' || size === 'icon',
          'h-8 w-8': size === 'md',
          'h-12 w-12': size === 'lg',
        },
        className,
      )}
      {...props}
    />
  )
}
