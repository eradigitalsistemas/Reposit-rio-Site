import { useFormContext, useFieldArray } from 'react-hook-form'
import { Briefcase, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { TalentosFormValues } from './schema'

export function StepExperience() {
  const { control } = useFormContext<TalentosFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'experiences' })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-secondary" /> Experiência Profissional
          </h3>
          <p className="text-sm text-muted-foreground">
            Compartilhe sua jornada e conquistas profissionais.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ empresa: '', cargo: '', data_inicio: '', data_fim: '', descricao: '' })
          }
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-destructive font-medium">
          Você precisa adicionar pelo menos uma experiência.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((item, index) => (
          <Card key={item.id} className="relative group overflow-visible">
            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-3 -top-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`experiences.${index}.empresa`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`experiences.${index}.cargo`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Desenvolvedor Sênior" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`experiences.${index}.data_inicio`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Início</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Março 2020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`experiences.${index}.data_fim`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Fim (deixe vazio se atual)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Atual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={control}
                  name={`experiences.${index}.descricao`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição das Atividades</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva brevemente suas responsabilidades e conquistas..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
