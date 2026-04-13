import { useFormContext } from 'react-hook-form'
import { Camera, Trash2 } from 'lucide-react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { TalentosFormValues } from './schema'

export function StepPersonal() {
  const {
    control,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<TalentosFormValues>()
  const fotoUrl = watch('personal.foto_url')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('personal.foto_url', { type: 'manual', message: 'Arquivo deve ter no máximo 5MB' })
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('personal.foto_url', {
        type: 'manual',
        message: 'Formato de imagem inválido (JPG, PNG, WebP)',
      })
      return
    }

    clearErrors('personal.foto_url')
    const reader = new FileReader()
    reader.onloadend = () => {
      setValue('personal.foto_url', reader.result as string, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Dados Pessoais</h3>
        <p className="text-muted-foreground">
          Comece nos contando quem você é e como podemos contatá-lo.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 p-4 bg-muted/30 rounded-lg border border-border">
        <Avatar className="w-24 h-24 border-2 border-primary/20 shadow-sm">
          <AvatarImage src={fotoUrl} className="object-cover" />
          <AvatarFallback className="bg-muted">
            <Camera className="h-8 w-8 text-muted-foreground/50" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <h4 className="font-medium text-sm">Foto de Perfil (Opcional)</h4>
          <p className="text-xs text-muted-foreground">
            Formatos suportados: JPG, PNG, WebP. Tamanho máximo: 5MB.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="foto-upload"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => document.getElementById('foto-upload')?.click()}
            >
              <Camera className="w-4 h-4 mr-2" /> Escolher Foto
            </Button>
            {fotoUrl && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setValue('personal.foto_url', '', { shouldValidate: true })}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Remover
              </Button>
            )}
          </div>
          {errors.personal?.foto_url && (
            <p className="text-sm text-destructive font-medium">
              {errors.personal.foto_url.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={control}
          name="personal.nome"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Nome Completo <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: João da Silva"
                  error={fieldState.invalid}
                  success={fieldState.isDirty && !fieldState.invalid && !!field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="personal.email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  E-mail <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="joao@exemplo.com"
                    error={fieldState.invalid}
                    success={fieldState.isDirty && !fieldState.invalid && !!field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personal.telefone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Telefone / WhatsApp <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: (11) 99999-9999"
                    error={fieldState.invalid}
                    success={fieldState.isDirty && !fieldState.invalid && !!field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="personal.data_nascimento"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Data de Nascimento (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    error={fieldState.invalid}
                    success={fieldState.isDirty && !fieldState.invalid && !!field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="personal.endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Rua das Flores, 123, São Paulo - SP"
                  className="resize-none h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
