import { CheckCircle2 } from 'lucide-react'

interface SuccessAnimationProps {
  type?: 'checkmark' | 'confetti'
  duration?: number
}

export function SuccessAnimation({ type = 'checkmark', duration = 600 }: SuccessAnimationProps) {
  // A simple confetti fallback could be implemented here, but checkmark is reliable for this use case
  return (
    <>
      <style>{`
        @keyframes success-bounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div className="flex justify-center mb-6">
        <div
          className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full"
          style={{
            animation: `success-bounce ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
          }}
        >
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
      </div>
    </>
  )
}
