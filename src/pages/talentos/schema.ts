import * as z from 'zod'

export const talentosSchema = z.object({
  personal: z.object({
    nome: z
      .string()
      .min(3, 'Nome completo é obrigatório (mínimo 3 caracteres)')
      .max(100, 'Máximo 100 caracteres')
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
    email: z.string().email('Email inválido. Formato esperado: usuario@dominio.com').max(255),
    telefone: z
      .string()
      .regex(
        /^\+55 \d{2} \d{4,5}-\d{4}$/,
        'Telefone inválido. Formato esperado: +55 89 99999-9999',
      ),
    data_nascimento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)')
      .refine((date) => {
        const d = new Date(date)
        return d >= new Date('1950-01-01') && d <= new Date()
      }, 'Data fora do intervalo permitido')
      .optional()
      .or(z.literal('')),
    endereco: z.string().max(200, 'Máximo 200 caracteres').optional().or(z.literal('')),
    foto_url: z.string().optional().or(z.literal('')),
  }),
  educations: z
    .array(
      z.object({
        instituicao: z
          .string()
          .min(2, 'Instituição é obrigatória')
          .max(150, 'Máximo 150 caracteres'),
        curso: z.string().min(2, 'Curso é obrigatório').max(150, 'Máximo 150 caracteres'),
        data_inicio: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)')
          .refine((date) => {
            const d = new Date(date)
            return d >= new Date('1950-01-01') && d <= new Date()
          }, 'Data fora do intervalo permitido'),
        data_fim: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)')
          .optional()
          .or(z.literal('')),
      }),
    )
    .min(1, 'Adicione pelo menos uma formação acadêmica')
    .max(10, 'Máximo de 10 formações permitidas')
    .superRefine((eds, ctx) => {
      eds.forEach((ed, index) => {
        if (ed.data_fim && ed.data_fim !== '') {
          if (new Date(ed.data_fim) < new Date(ed.data_inicio)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Data de término deve ser posterior à data de início',
              path: [index, 'data_fim'],
            })
          }
        }
      })
    }),
})

export type TalentosFormValues = z.infer<typeof talentosSchema>

export const defaultTalentosValues: Partial<TalentosFormValues> = {
  personal: {
    nome: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    endereco: '',
    foto_url: '',
  },
  educations: [{ instituicao: '', curso: '', data_inicio: '', data_fim: '' }],
}
