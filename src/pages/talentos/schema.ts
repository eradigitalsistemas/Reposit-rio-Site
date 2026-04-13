import * as z from 'zod'

export const talentosSchema = z.object({
  personal: z.object({
    nome: z.string().min(3, 'Nome completo é obrigatório'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(14, 'Telefone incompleto'),
    data_nascimento: z.string().min(10, 'Data inválida (DD/MM/AAAA)'),
    endereco: z.string().min(5, 'Endereço é obrigatório'),
    foto_url: z.string().url('URL de foto inválida').optional().or(z.literal('')),
  }),
  educations: z
    .array(
      z.object({
        instituicao: z.string().min(2, 'Instituição é obrigatória'),
        curso: z.string().min(2, 'Curso é obrigatório'),
        data_inicio: z.string().min(4, 'Ano de início obrigatório'),
        data_fim: z.string().optional(),
      }),
    )
    .min(1, 'Adicione pelo menos uma formação acadêmica'),
  experiences: z
    .array(
      z.object({
        empresa: z.string().min(2, 'Empresa é obrigatória'),
        cargo: z.string().min(2, 'Cargo é obrigatório'),
        data_inicio: z.string().min(4, 'Ano de início obrigatório'),
        data_fim: z.string().optional(),
        descricao: z.string().optional(),
      }),
    )
    .min(1, 'Adicione pelo menos uma experiência profissional'),
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
