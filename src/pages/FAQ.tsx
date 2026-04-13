import { useState, useMemo } from 'react'
import { HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { FAQSearch } from '@/components/blocks/FAQSearch'
import { FAQAccordion } from '@/components/blocks/FAQAccordion'

const faqsData = [
  {
    category: 'Certificados',
    q: 'O que é um certificado digital A1?',
    a: 'É um certificado digital emitido e armazenado diretamente no computador do usuário, com validade de 1 ano. Ideal para emissão de notas fiscais.',
  },
  {
    category: 'Certificados',
    q: 'Qual a diferença entre e-CPF e e-CNPJ?',
    a: 'O e-CPF é a identidade digital para pessoas físicas, permitindo assinar documentos. O e-CNPJ é a identidade digital da pessoa jurídica, usado para relacionamentos com a Receita Federal e emissão de notas.',
  },
  {
    category: 'Certificados',
    q: 'Como faço para renovar meu certificado?',
    a: 'A renovação pode ser feita de forma 100% online caso você ainda possua a biometria cadastrada no sistema e o certificado atual esteja válido.',
  },
  {
    category: 'ERP',
    q: 'O sistema ERP atende pequenas empresas?',
    a: 'Sim, nossos sistemas são modulares e escaláveis. Você contrata apenas o que precisa hoje e expande conforme sua empresa cresce.',
  },
  {
    category: 'ERP',
    q: 'Quanto tempo leva a implantação do ERP?',
    a: 'O tempo médio de implantação é de 15 a 30 dias, dependendo da complexidade dos módulos escolhidos e da migração de dados.',
  },
  {
    category: 'ERP',
    q: 'O sistema possui backup em nuvem?',
    a: 'Absolutamente. Todos os dados são salvos em servidores de alta segurança em nuvem, com backups automáticos diários.',
  },
  {
    category: 'Currículo',
    q: 'Como funciona o teste comportamental DISC?',
    a: 'É um questionário rápido que avalia suas tendências naturais de comportamento: Dominância, Influência, Estabilidade e Conformidade.',
  },
  {
    category: 'Currículo',
    q: 'Meus dados do currículo estão seguros?',
    a: 'Totalmente seguros. Seguimos rigorosamente as normas da LGPD, e seus dados são acessados apenas pela nossa equipe de RH e parceiros autorizados.',
  },
  {
    category: 'Currículo',
    q: 'Por quanto tempo meu PDF fica disponível?',
    a: 'O link para download do seu currículo gerado em PDF fica disponível por 24 horas por questões de segurança e privacidade.',
  },
  {
    category: 'Geral',
    q: 'Quais são os horários de atendimento do suporte?',
    a: 'Nosso suporte técnico funciona de segunda a sexta-feira, das 8h às 18h (horário de Brasília).',
  },
  {
    category: 'Geral',
    q: 'Como entro em contato com o setor comercial?',
    a: 'Você pode utilizar os botões de WhatsApp espalhados pelo site ou enviar um e-mail diretamente para comercial@areradigital.com.br.',
  },
]

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) return faqsData
    const lower = searchTerm.toLowerCase()
    return faqsData.filter(
      (f) =>
        f.q.toLowerCase().includes(lower) ||
        f.a.toLowerCase().includes(lower) ||
        f.category.toLowerCase().includes(lower),
    )
  }, [searchTerm])

  // Group by category
  const groupedFaqs = useMemo(() => {
    const groups: Record<string, typeof faqsData> = {}
    filteredFaqs.forEach((faq) => {
      if (!groups[faq.category]) groups[faq.category] = []
      groups[faq.category].push(faq)
    })
    return groups
  }, [filteredFaqs])

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex h-12 w-12 rounded-full bg-primary/10 text-primary items-center justify-center mb-2">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Perguntas Frequentes</h1>
        <p className="text-muted-foreground text-lg">
          Encontre respostas rápidas para as dúvidas mais comuns sobre nossos serviços.
        </p>
      </div>

      <FAQSearch onSearch={setSearchTerm} />

      {Object.keys(groupedFaqs).length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="text-muted-foreground">
            Nenhuma pergunta encontrada para "{searchTerm}".
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFaqs).map(([category, questions]) => (
            <FAQAccordion
              key={category}
              category={category}
              items={questions.map((q) => ({ question: q.q, answer: q.a }))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
