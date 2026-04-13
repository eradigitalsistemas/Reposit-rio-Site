import { useFormContext } from 'react-hook-form'
import { formatPhone } from '@/lib/utils'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TalentosFormValues } from './schema'

export function StepPersonal() {
  const { control } = useFormContext<TalentosFormValues>()

  const formatDate = (val: string) => {
    const v = val.replace(/\D/g, '').slice(0, 8)
    if (v.length >= 5) return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`
    if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`
    return v
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Dados Pessoais</h3>
        <p className="text-sm text-muted-foreground">
          Comece nos contando quem você é e como podemos contatá-lo.
        </p>
      </div>

      <FormField
        control={control}
        name="personal.nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="João da Silva" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="personal.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="joao@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personal.telefone"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Telefone / WhatsApp</FormLabel>
              <FormControl>
                <Input
                  placeholder="(00) 00000-0000"
                  value={value}
                  onChange={(e) => onChange(formatPhone(e.target.value))}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="personal.data_nascimento"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input
                  placeholder="DD/MM/AAAA"
                  value={value}
                  onChange={(e) => onChange(formatDate(e.target.value))}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personal.foto_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Foto (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                Link para sua foto de perfil (LinkedIn, Github, etc).
              </FormDescription>
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
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input placeholder="Rua, Número, Cidade - Estado" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
