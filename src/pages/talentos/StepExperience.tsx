import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StepExperience() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
            <span>Experiência Profissional</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Adicione suas experiências mais relevantes (mínimo 1)
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ empresa: '', cargo: '', data_inicio: '', data_fim: '', descricao: '' })
          }
          disabled={fields.length >= 15}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </div>

      {errors.experiences?.root && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md mb-4">
          {errors.experiences.root.message as string}
        </div>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => {
          const fieldErrors = (errors.experiences as any)?.[index]

          return (
            <Card key={field.id} className="relative animate-fade-in-up">
              <CardContent className="p-6">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor={`experiences.${index}.empresa`}>Empresa *</Label>
                    <Input
                      id={`experiences.${index}.empresa`}
                      placeholder="Nome da empresa"
                      {...register(`experiences.${index}.empresa`)}
                      error={!!fieldErrors?.empresa}
                    />
                    {fieldErrors?.empresa && (
                      <p className="text-xs text-destructive">{fieldErrors.empresa.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`experiences.${index}.cargo`}>Cargo *</Label>
                    <Input
                      id={`experiences.${index}.cargo`}
                      placeholder="Seu cargo/função"
                      {...register(`experiences.${index}.cargo`)}
                      error={!!fieldErrors?.cargo}
                    />
                    {fieldErrors?.cargo && (
                      <p className="text-xs text-destructive">{fieldErrors.cargo.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`experiences.${index}.data_inicio`}>Data de Início *</Label>
                    <Input
                      type="date"
                      id={`experiences.${index}.data_inicio`}
                      {...register(`experiences.${index}.data_inicio`)}
                      error={!!fieldErrors?.data_inicio}
                    />
                    {fieldErrors?.data_inicio && (
                      <p className="text-xs text-destructive">{fieldErrors.data_inicio.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`experiences.${index}.data_fim`}>Data de Término</Label>
                    <Input
                      type="date"
                      id={`experiences.${index}.data_fim`}
                      {...register(`experiences.${index}.data_fim`)}
                      error={!!fieldErrors?.data_fim}
                    />
                    {fieldErrors?.data_fim && (
                      <p className="text-xs text-destructive">{fieldErrors.data_fim.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Deixe em branco se for o emprego atual
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`experiences.${index}.descricao`}>
                      Descrição das Atividades
                    </Label>
                    <Textarea
                      id={`experiences.${index}.descricao`}
                      placeholder="Descreva suas principais responsabilidades e conquistas..."
                      {...register(`experiences.${index}.descricao`)}
                      className={cn(
                        'min-h-[100px]',
                        fieldErrors?.descricao && 'border-destructive',
                      )}
                    />
                    {fieldErrors?.descricao && (
                      <p className="text-xs text-destructive">{fieldErrors.descricao.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
