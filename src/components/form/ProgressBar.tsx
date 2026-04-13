import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / total) * 100))

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <Progress value={percentage} className="h-2 rounded-full" />
    </div>
  )
}
