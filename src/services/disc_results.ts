import pb from '@/lib/pocketbase/client'

export interface DiscResultData {
  user_id?: string
  tipo_perfil?: string
  pontuacao_d?: number
  pontuacao_i?: number
  pontuacao_s?: number
  pontuacao_c?: number
  data_teste?: string
}

export const getDiscResults = () => pb.collection('disc_results').getFullList()
export const getDiscResult = (id: string) => pb.collection('disc_results').getOne(id)
export const createDiscResult = (data: DiscResultData) => {
  const payload = {
    ...data,
    data_teste: data.data_teste || new Date().toISOString(),
  }
  return pb.collection('disc_results').create(payload)
}
export const updateDiscResult = (id: string, data: Partial<DiscResultData>) =>
  pb.collection('disc_results').update(id, data)
export const deleteDiscResult = (id: string) => pb.collection('disc_results').delete(id)
