import { useFormContext, useFieldArray } from 'react-hook-form'
import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { TalentosFormValues } from './schema'

export function StepEducation() {
  const { control } = useFormContext<TalentosFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'educations' })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-secondary" /> Formação Acadêmica
          </h3>
          <p className="text-sm text-muted-foreground">
            Liste seus cursos, graduações ou certificações relevantes.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ instituicao: '', curso: '', data_inicio: '', data_fim: '' })}
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-destructive font-medium">
          Você precisa adicionar pelo menos uma formação.
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
                name={`educations.${index}.instituicao`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instituição</FormLabel>
                    <FormControl>
                      <Input placeholder="Universidade X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`educations.${index}.curso`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <FormControl>
                      <Input placeholder="Engenharia de Software" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`educations.${index}.data_inicio`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Início</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 2018" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`educations.${index}.data_fim`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Fim (ou Previsão)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 2022" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
