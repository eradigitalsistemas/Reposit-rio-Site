import { Shield } from 'lucide-react'

export default function Politicas() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8 border-b pb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Políticas de Privacidade</h1>
      </div>
      <div className="prose prose-green dark:prose-invert max-w-none text-muted-foreground">
        <p className="font-medium text-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">1. Introdução</h2>
        <p className="mb-4">
          A Super Era Digital ("nós", "nosso" ou "nossa") respeita a sua privacidade e está
          comprometida em proteger os seus dados pessoais. Esta política de privacidade informa como
          lidamos com os seus dados pessoais, seus direitos de privacidade e como a lei o protege,
          em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">
          2. Os dados que coletamos sobre você
        </h2>
        <p className="mb-4">
          Podemos coletar, usar, armazenar e transferir diferentes tipos de dados pessoais sobre
          você, que agrupamos da seguinte forma:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong className="text-foreground">Dados de Identidade:</strong> incluem nome,
            sobrenome, nome de usuário ou identificador semelhante, estado civil, título, data de
            nascimento e gênero.
          </li>
          <li>
            <strong className="text-foreground">Dados de Contato:</strong> incluem endereço de
            cobrança, endereço de entrega, endereço de e-mail e números de telefone.
          </li>
          <li>
            <strong className="text-foreground">Dados Técnicos:</strong> incluem endereço de
            protocolo de internet (IP), seus dados de login, tipo e versão do navegador,
            configuração de fuso horário e localização, e outras tecnologias nos dispositivos que
            você usa para acessar este site.
          </li>
          <li>
            <strong className="text-foreground">Dados de Currículo:</strong> informações
            profissionais, histórico acadêmico e resultados de avaliações (como DISC) quando
            fornecidos voluntariamente através de nossa plataforma de Banco de Talentos.
          </li>
        </ul>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">
          3. Como usamos os seus dados pessoais
        </h2>
        <p className="mb-4">
          Só usaremos os seus dados pessoais quando a lei nos permitir. Mais comumente, usaremos
          seus dados pessoais nas seguintes circunstâncias:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            Quando precisarmos executar o contrato que estamos prestes a celebrar ou que já
            celebramos com você.
          </li>
          <li>
            Quando for necessário para os nossos interesses legítimos (ou de terceiros) e os seus
            interesses e direitos fundamentais não se sobrepuserem a esses interesses.
          </li>
          <li>Quando precisarmos cumprir uma obrigação legal ou regulatória.</li>
        </ul>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">4. Segurança dos dados</h2>
        <p className="mb-4">
          Implementamos medidas de segurança apropriadas para evitar que seus dados pessoais sejam
          acidentalmente perdidos, usados ou acessados de forma não autorizada, alterados ou
          divulgados. Além disso, limitamos o acesso aos seus dados pessoais aos funcionários,
          agentes, contratados e outros terceiros que têm uma necessidade comercial de conhecê-los.
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">5. Seus direitos legais</h2>
        <p className="mb-4">
          Sob certas circunstâncias, você tem direitos sob as leis de proteção de dados em relação
          aos seus dados pessoais, incluindo o direito de solicitar acesso, correção, apagamento,
          restrição, transferência ou o direito de objetar ao processamento. Para exercer qualquer
          um desses direitos, entre em contato conosco.
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">6. Contato</h2>
        <p className="mb-4">
          Para questões relacionadas a esta política de privacidade, entre em contato através do
          e-mail: <strong className="text-foreground">comercial@areradigital.com.br</strong>
        </p>
      </div>
    </div>
  )
}
