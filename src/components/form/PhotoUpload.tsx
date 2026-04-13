import { useState, useRef } from 'react'
import { Camera, Trash2, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  value?: string
  onChange: (value: string) => void
  maxSizeMB?: number
  error?: string
}

export function PhotoUpload({ value, onChange, maxSizeMB = 5, error }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setLocalError(null)

    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`O arquivo deve ter no máximo ${maxSizeMB}MB`)
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setLocalError('Formato inválido. Use JPG, PNG ou WebP.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="space-y-3 w-full">
      <div
        className={cn(
          'flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-dashed rounded-xl transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border hover:border-primary/50 hover:bg-muted/30',
          (error || localError) && 'border-destructive bg-destructive/5 hover:border-destructive',
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Avatar className="w-24 h-24 border shadow-sm ring-4 ring-background">
          <AvatarImage src={value} className="object-cover" />
          <AvatarFallback className="bg-muted">
            <Camera className="h-8 w-8 text-muted-foreground/50" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left space-y-2.5">
          <div>
            <h4 className="text-sm font-semibold">Foto de Perfil</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Arraste uma imagem ou clique no botão. Formatos suportados: JPG, PNG, WebP. Tamanho
              máximo: {maxSizeMB}MB.
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              ref={inputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0])
                e.target.value = '' // reset input so same file can be chosen again
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloud className="w-4 h-4 mr-2" /> Escolher Arquivo
            </Button>
            {value && (
              <Button type="button" variant="destructive" size="sm" onClick={() => onChange('')}>
                <Trash2 className="h-4 w-4 mr-2" /> Remover
              </Button>
            )}
          </div>
        </div>
      </div>
      {(error || localError) && (
        <p className="text-sm text-destructive font-medium animate-fade-in flex items-center">
          {error || localError}
        </p>
      )}
    </div>
  )
}
