import * as z from 'zod'

export const talentosSchema = z.object({
  personal: z.object({
    nome: z
      .string()
      .min(3, 'Nome completo é obrigatório')
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
      }, 'Data fora do intervalo permitido'),
    endereco: z.string().min(5, 'Endereço é obrigatório').max(200, 'Máximo 200 caracteres'),
    foto_url: z
      .string()
      .url('URL de foto inválida')
      .regex(/^https:\/\//, 'Apenas HTTPS é permitido')
      .regex(/\.(jpg|jpeg|png|webp)(\?.*)?$/i, 'Formato de imagem inválido (JPG, PNG, WebP)')
      .optional()
      .or(z.literal('')),
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
    .superRefine((eds, ctx) => {
      eds.forEach((ed, index) => {
        if (ed.data_fim && ed.data_fim !== '') {
          if (new Date(ed.data_fim) < new Date(ed.data_inicio)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Data de fim não pode ser anterior à data de início',
              path: [index, 'data_fim'],
            })
          }
        }
      })
    }),
  experiences: z
    .array(
      z.object({
        empresa: z.string().min(2, 'Empresa é obrigatória').max(150, 'Máximo 150 caracteres'),
        cargo: z.string().min(2, 'Cargo é obrigatório').max(150, 'Máximo 150 caracteres'),
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
        descricao: z.string().max(500, 'Máximo 500 caracteres').optional(),
      }),
    )
    .min(1, 'Adicione pelo menos uma experiência profissional')
    .superRefine((exps, ctx) => {
      exps.forEach((exp, index) => {
        if (exp.data_fim && exp.data_fim !== '') {
          if (new Date(exp.data_fim) < new Date(exp.data_inicio)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Data de fim não pode ser anterior à data de início',
              path: [index, 'data_fim'],
            })
          }
        }
      })
    }),
  disc: z.object({
    q1: z.string().min(1, 'Selecione uma opção'),
    q2: z.string().min(1, 'Selecione uma opção'),
    q3: z.string().min(1, 'Selecione uma opção'),
    q4: z.string().min(1, 'Selecione uma opção'),
  }),
  lgpd: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos de privacidade'),
})

export type TalentosFormValues = z.infer<typeof talentosSchema>

// Default empty state
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
  experiences: [{ empresa: '', cargo: '', data_inicio: '', data_fim: '', descricao: '' }],
  disc: { q1: '', q2: '', q3: '', q4: '' },
  lgpd: false,
}
