interface ConfirmationMessageProps {
  message: string
  subMessage?: string
}

export function ConfirmationMessage({ message, subMessage }: ConfirmationMessageProps) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold mb-4 text-foreground">{message}</h1>
      {subMessage && <p className="text-lg text-muted-foreground max-w-xl mx-auto">{subMessage}</p>}
    </div>
  )
}
