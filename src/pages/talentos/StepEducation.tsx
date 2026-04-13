import { useFormContext, useFieldArray } from 'react-hook-form'
import { GraduationCap, Plus, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TalentosFormValues } from './schema'

export function StepEducation() {
  const { control } = useFormContext<TalentosFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'educations' })

  const maxEducations = 10

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" /> Educação
          </h3>
          <p className="text-muted-foreground">Liste suas formações, cursos ou certificações.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ instituicao: '', curso: '', data_inicio: '', data_fim: '' })}
          disabled={fields.length >= maxEducations}
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Formação
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">
            Você precisa adicionar pelo menos uma formação acadêmica.
          </p>
        </div>
      )}

      {fields.length >= maxEducations && (
        <p className="text-sm text-amber-600 font-medium">
          Você atingiu o limite de {maxEducations} formações.
        </p>
      )}

      <div className="space-y-6 mt-6">
        {fields.map((item, index) => (
          <Card
            key={item.id}
            className="relative group overflow-visible border-border/50 shadow-sm transition-all hover:shadow-md"
          >
            <CardHeader className="py-4 px-6 border-b bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">Formação {index + 1}</CardTitle>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remover
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={control}
                name={`educations.${index}.instituicao`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Instituição <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Universidade de São Paulo"
                        {...field}
                        error={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`educations.${index}.curso`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Curso <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Engenharia de Software"
                        {...field}
                        error={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`educations.${index}.data_inicio`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Data de Início <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        {...field}
                        error={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`educations.${index}.data_fim`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Data de Término (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} error={fieldState.invalid} />
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
