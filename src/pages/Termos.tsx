import { FileText } from 'lucide-react'

export default function Termos() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold">Termos de Uso</h1>
      </div>

      <div className="prose prose-green dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <p>
          Bem-vindo à <strong>Era Digital</strong>. Ao acessar e utilizar nosso site e serviços,
          você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. Leia atentamente
          antes de prosseguir.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8">1. Aceitação dos Termos</h2>
        <p>
          O uso dos serviços da Era Digital implica na aceitação integral destes Termos de Uso e da
          nossa Política de Privacidade. Caso não concorde com algum dos termos, solicitamos que não
          utilize nossos serviços.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8">2. Uso dos Serviços</h2>
        <p>
          Nossos serviços, incluindo a plataforma de currículos e geração de PDFs formatados, são
          oferecidos para fins profissionais. Você se compromete a fornecer informações verdadeiras,
          precisas e atualizadas ao preencher formulários.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8">3. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo presente no site, incluindo textos, gráficos, logotipos, ícones, imagens e
          software, é de propriedade exclusiva da Era Digital ou de seus licenciadores, sendo
          protegido pelas leis de direitos autorais e propriedade intelectual.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8">
          4. Responsabilidades do Usuário
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Não utilizar a plataforma para fins ilegais ou não autorizados;</li>
          <li>Não tentar comprometer a segurança ou a integridade dos sistemas;</li>
          <li>Garantir que os documentos e currículos gerados sejam usados de forma ética;</li>
          <li>Não enviar conteúdo malicioso, vírus ou códigos destrutivos.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mt-8">
          5. Limitação de Responsabilidade
        </h2>
        <p>
          A Era Digital não se responsabiliza por eventuais danos diretos, indiretos, incidentais ou
          consequenciais resultantes do uso ou da incapacidade de uso dos nossos serviços,
          incluindo, mas não se limitando a, perda de dados ou lucros cessantes.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8">6. Modificações dos Termos</h2>
        <p>
          Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento, sem aviso
          prévio. As alterações entrarão em vigor imediatamente após a publicação no site. O uso
          contínuo dos serviços constituirá sua aceitação das novas condições.
        </p>

        <div className="mt-12 p-6 bg-muted rounded-lg border border-border">
          <p className="font-medium text-foreground mb-2">Dúvidas?</p>
          <p>
            Caso tenha alguma dúvida sobre os nossos Termos de Uso, entre em contato através do
            nosso WhatsApp Comercial: <strong>+55 89 9938-0203</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
