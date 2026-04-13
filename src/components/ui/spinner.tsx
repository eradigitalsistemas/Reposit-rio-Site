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
          'h-4 w-4': size === 'sm' || size === 'icon',
          'h-6 w-6': size === 'md',
          'h-8 w-8': size === 'lg',
        },
        className,
      )}
      {...props}
    />
  )
}
