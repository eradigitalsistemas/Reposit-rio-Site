import { Shield } from 'lucide-react'

export default function Politicas() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold">Política de Privacidade</h1>
      </div>

      <div className="prose prose-green dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <p>
          A <strong>Era Digital</strong> tem o compromisso de proteger a sua privacidade e garantir
          a segurança dos seus dados pessoais. Esta Política de Privacidade explica como coletamos,
          usamos, compartilhamos e protegemos as informações que você nos fornece.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8">1. Coleta de Dados</h2>
        <p>
          Coletamos informações que você nos fornece diretamente ao preencher formulários, enviar
          currículos, assinar newsletters ou entrar em contato conosco. Isso pode incluir seu nome,
          e-mail, número de telefone, dados profissionais e outras informações relevantes.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8">2. Uso das Informações</h2>
        <p>Utilizamos seus dados para:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Fornecer, operar e manter nossos serviços;</li>
          <li>Processar currículos e conectar talentos a oportunidades;</li>
          <li>Enviar comunicações, atualizações e alertas relevantes;</li>
          <li>Responder a dúvidas e prestar suporte técnico;</li>
          <li>Melhorar e personalizar a experiência do usuário.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mt-8">
          3. Compartilhamento de Dados
        </h2>
        <p>
          Não vendemos ou alugamos seus dados pessoais para terceiros. Suas informações podem ser
          compartilhadas apenas com parceiros de confiança que nos auxiliam na operação do sistema,
          sempre sob rigorosos acordos de confidencialidade e em conformidade com a LGPD.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8">4. Segurança</h2>
        <p>
          Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra
          acesso não autorizado, alteração, divulgação ou destruição. Seus dados são armazenados em
          servidores seguros com acesso restrito.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8">5. Seus Direitos</h2>
        <p>
          Você tem o direito de solicitar o acesso, correção, atualização ou exclusão dos seus dados
          pessoais a qualquer momento. Para exercer esses direitos, entre em contato conosco através
          dos nossos canais oficiais de suporte.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8">
          6. Alterações nesta Política
        </h2>
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em
          nossas práticas ou requisitos legais. Recomendamos que você revise esta página
          regularmente.
        </p>

        <div className="mt-12 p-6 bg-muted rounded-lg border border-border">
          <p className="font-medium text-foreground mb-2">Contato</p>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo
            WhatsApp de Suporte: <strong>+55 89 9418-4931</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
