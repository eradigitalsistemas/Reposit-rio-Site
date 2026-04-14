import * as z from 'zod'

export const talentosSchema = z.object({
  personal: z.object({
    nome: z
      .string()
      .min(3, 'Nome completo é obrigatório (mínimo 3 caracteres)')
      .max(100, 'Máximo 100 caracteres')
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
    email: z.string().email('Email inválido. Formato esperado: usuario@dominio.com').max(255),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
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
        descricao: z.string().max(500, 'Máximo 500 caracteres').optional().or(z.literal('')),
      }),
    )
    .min(1, 'Adicione pelo menos uma experiência profissional')
    .max(15, 'Máximo de 15 experiências permitidas')
    .superRefine((exps, ctx) => {
      exps.forEach((exp, index) => {
        if (exp.data_fim && exp.data_fim !== '') {
          if (new Date(exp.data_fim) < new Date(exp.data_inicio)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Data de término deve ser posterior à data de início',
              path: [index, 'data_fim'],
            })
          }
        }
      })
    }),
  additional_info: z
    .object({
      resumo_profissional: z
        .string()
        .max(2000, 'Máximo 2000 caracteres')
        .optional()
        .or(z.literal('')),
      soft_skills: z.string().max(1000, 'Máximo 1000 caracteres').optional().or(z.literal('')),
      hard_skills: z.string().max(1000, 'Máximo 1000 caracteres').optional().or(z.literal('')),
      cursos_adicionais: z
        .string()
        .max(2000, 'Máximo 2000 caracteres')
        .optional()
        .or(z.literal('')),
      idiomas: z.string().max(1000, 'Máximo 1000 caracteres').optional().or(z.literal('')),
    })
    .optional(),
  disc: z.object({
    q1: z.string().min(1, 'Responda a esta pergunta'),
    q2: z.string().min(1, 'Responda a esta pergunta'),
    q3: z.string().min(1, 'Responda a esta pergunta'),
    q4: z.string().min(1, 'Responda a esta pergunta'),
    q5: z.string().min(1, 'Responda a esta pergunta'),
    q6: z.string().min(1, 'Responda a esta pergunta'),
    q7: z.string().min(1, 'Responda a esta pergunta'),
    q8: z.string().min(1, 'Responda a esta pergunta'),
    q9: z.string().min(1, 'Responda a esta pergunta'),
    q10: z.string().min(1, 'Responda a esta pergunta'),
    q11: z.string().min(1, 'Responda a esta pergunta'),
    q12: z.string().min(1, 'Responda a esta pergunta'),
  }),
  lgpd: z
    .boolean()
    .refine((val) => val === true, 'Você deve aceitar os termos de privacidade')
    .optional(),
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
  experiences: [{ empresa: '', cargo: '', data_inicio: '', data_fim: '', descricao: '' }],
  additional_info: {
    resumo_profissional: '',
    soft_skills: '',
    hard_skills: '',
    cursos_adicionais: '',
    idiomas: '',
  },
  disc: {
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
    q10: '',
    q11: '',
    q12: '',
  },
  lgpd: false,
}
