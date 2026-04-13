import { FileText } from 'lucide-react'

export default function Termos() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8 border-b pb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Termos de Uso</h1>
      </div>
      <div className="prose prose-green dark:prose-invert max-w-none text-muted-foreground">
        <p className="font-medium text-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">1. Aceitação dos Termos</h2>
        <p className="mb-4">
          Ao acessar e usar o site da Super Era Digital, você concorda em cumprir e ficar vinculado
          aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes
          termos, por favor, não use nosso site.
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">2. Uso do Site</h2>
        <p className="mb-4">
          O conteúdo das páginas deste site é apenas para sua informação geral e uso. Ele está
          sujeito a alterações sem aviso prévio.
        </p>
        <p className="mb-4">
          Nem nós nem terceiros oferecemos qualquer garantia ou garantia quanto à precisão,
          pontualidade, desempenho, integridade ou adequação das informações e materiais encontrados
          ou oferecidos neste site para qualquer finalidade específica. Você reconhece que tais
          informações e materiais podem conter imprecisões ou erros e nós expressamente excluímos a
          responsabilidade por quaisquer imprecisões ou erros na extensão máxima permitida por lei.
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">
          3. Propriedade Intelectual
        </h2>
        <p className="mb-4">
          Este site contém material que é de nossa propriedade ou licenciado para nós. Este material
          inclui, mas não se limita a, design, layout, aparência, aparência e gráficos. A reprodução
          é proibida, exceto de acordo com o aviso de direitos autorais, que faz parte destes termos
          e condições.
        </p>
        <p className="mb-4">
          Todas as marcas registradas reproduzidas neste site que não são de propriedade de, ou
          licenciadas para, o operador são reconhecidas no site.
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">4. Uso Não Autorizado</h2>
        <p className="mb-4">
          O uso não autorizado deste site pode dar origem a uma reclamação por danos e/ou ser uma
          ofensa criminal.
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">
          5. Links para Outros Sites
        </h2>
        <p className="mb-4">
          De tempos em tempos, este site também pode incluir links para outros sites. Esses links
          são fornecidos para sua conveniência para fornecer mais informações. Eles não significam
          que endossamos o(s) site(s). Não temos responsabilidade pelo conteúdo do(s) site(s)
          vinculado(s).
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">
          6. Banco de Talentos e Submissão de Dados
        </h2>
        <p className="mb-4">
          Ao submeter seu currículo e informações através do nosso Banco de Talentos, você declara
          que todas as informações fornecidas são verdadeiras e precisas. Você concorda que as
          informações fornecidas, incluindo resultados de testes comportamentais (como o teste
          DISC), serão utilizadas pela Super Era Digital para fins de recrutamento, seleção e
          análise de perfil, conforme descrito em nossa Política de Privacidade.
        </p>

        <h2 className="text-foreground text-xl font-semibold mt-8 mb-4">7. Lei Aplicável</h2>
        <p className="mb-4">
          O uso deste site e qualquer disputa decorrente de tal uso do site estão sujeitos às leis
          do Brasil, com foro na comarca de Floriano/PI para dirimir quaisquer questões.
        </p>
      </div>
    </div>
  )
}
