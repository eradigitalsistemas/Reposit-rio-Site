import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { TalentosFormValues } from './schema'

export function StepAdditional() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TalentosFormValues>()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Habilidades e Informações Adicionais</h2>
        <p className="text-muted-foreground mt-1">
          Preencha os campos abaixo para enriquecer seu currículo. Estes dados são opcionais, mas
          ajudam muito na avaliação.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Resumo Profissional</CardTitle>
          <CardDescription>
            Faça um breve resumo da sua carreira, objetivos e principais conquistas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              {...register('additional_info.resumo_profissional')}
              placeholder="Ex: Profissional com 5 anos de experiência na área de tecnologia..."
              className="min-h-[120px]"
            />
            {errors.additional_info?.resumo_profissional && (
              <p className="text-sm text-destructive">
                {errors.additional_info.resumo_profissional.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Soft Skills (Comportamentais)</CardTitle>
            <CardDescription>Habilidades comportamentais.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea
                {...register('additional_info.soft_skills')}
                placeholder="Ex: Trabalho em equipe, Resiliência, Proatividade..."
                className="min-h-[100px]"
              />
              {errors.additional_info?.soft_skills && (
                <p className="text-sm text-destructive">
                  {errors.additional_info.soft_skills.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Hard Skills (Técnicas)</CardTitle>
            <CardDescription>Habilidades técnicas ou ferramentas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea
                {...register('additional_info.hard_skills')}
                placeholder="Ex: Excel Avançado, Inglês Técnico, JavaScript..."
                className="min-h-[100px]"
              />
              {errors.additional_info?.hard_skills && (
                <p className="text-sm text-destructive">
                  {errors.additional_info.hard_skills.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Cursos Adicionais</CardTitle>
            <CardDescription>Cursos extracurriculares, workshops ou certificações.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea
                {...register('additional_info.cursos_adicionais')}
                placeholder="Ex: Curso de Oratória (20h), Certificação Agile..."
                className="min-h-[100px]"
              />
              {errors.additional_info?.cursos_adicionais && (
                <p className="text-sm text-destructive">
                  {errors.additional_info.cursos_adicionais.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Idiomas</CardTitle>
            <CardDescription>Idiomas que você domina e o nível de fluência.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea
                {...register('additional_info.idiomas')}
                placeholder="Ex: Inglês (Avançado), Espanhol (Básico)..."
                className="min-h-[100px]"
              />
              {errors.additional_info?.idiomas && (
                <p className="text-sm text-destructive">{errors.additional_info.idiomas.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
