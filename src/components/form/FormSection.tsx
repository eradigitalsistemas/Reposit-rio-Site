import { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'

interface FormSectionProps {
  title: string
  description?: string
  stepNumber: number
  totalSteps: number
  children: ReactNode
}

export function FormSection({
  title,
  description,
  stepNumber,
  totalSteps,
  children,
}: FormSectionProps) {
  return (
    <div className="space-y-6 animate-fade-in-up w-full">
      <div className="space-y-5">
        <ProgressBar
          current={stepNumber}
          total={totalSteps}
          label={`Passo ${stepNumber} de ${totalSteps}`}
        />
        <div>
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          {description && (
            <p className="text-muted-foreground mt-1.5 text-sm md:text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  )
}
