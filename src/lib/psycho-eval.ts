export interface Question {
  id: string
  text: string
  invert?: boolean
}

export interface Dimension {
  id: string
  title: string
  questions: Question[]
}

// According to AC: Positive statements (which decrease risk when rated high) must be inverted
// so that a higher final score ALWAYS equates to a HIGHER RISK.
// Positive (Invert): 1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 24, 25, 27, 28, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 45.
// Negative (Keep Raw): 4, 5, 16, 17, 18, 26, 29, 30, 31, 32, 33, 44.
export const PSYCHO_DIMENSIONS: Dimension[] = [
  {
    id: 'A',
    title: 'Organização do Trabalho',
    questions: [
      {
        id: 'q1',
        text: '1. Minhas tarefas são claramente definidas e sei exatamente o que se espera de mim no dia a dia.',
        invert: true,
      },
      {
        id: 'q2',
        text: '2. A quantidade de trabalho que recebo é compatível com o tempo disponível para realizá-lo.',
        invert: true,
      },
      {
        id: 'q3',
        text: '3. Tenho autonomia para decidir a ordem e o método de execução das minhas tarefas.',
        invert: true,
      },
      {
        id: 'q4',
        text: '4. O ritmo de trabalho é intenso e frequentemente me sinto pressionado(a) a cumprir prazos apertados.',
      },
      {
        id: 'q5',
        text: '5. Existe sobrecarga de trabalho devido a metas excessivas ou impossíveis de alcançar.',
      },
      {
        id: 'q6',
        text: '6. Posso interromper meu trabalho quando necessário (para descanso, necessidades pessoais, etc.) sem sofrer consequências negativas.',
        invert: true,
      },
    ],
  },
  {
    id: 'B',
    title: 'Condições de Trabalho',
    questions: [
      {
        id: 'q7',
        text: '7. As condições do ambiente físico (iluminação, temperatura, ruído, ventilação) são adequadas para a realização do meu trabalho.',
        invert: true,
      },
      {
        id: 'q8',
        text: '8. Disponho de todos os equipamentos, ferramentas e materiais necessários para executar minhas funções com qualidade e segurança.',
        invert: true,
      },
      {
        id: 'q9',
        text: '9. Sinto que o mobiliário e o posto de trabalho são adequados ergonomicamente (conforme NR-17).',
        invert: true,
      },
      {
        id: 'q10',
        text: '10. A organização realiza avaliações e ajustes periódicos das condições físicas e ergonômicas do ambiente de trabalho.',
        invert: true,
      },
      {
        id: 'q11',
        text: '11. Sinto-me seguro(a) fisicamente no meu local de trabalho (riscos de acidentes, violência externa, etc.).',
        invert: true,
      },
      {
        id: 'q12',
        text: '12. As pausas e intervalos previstos são respeitados e efetivamente usufruídos pela equipe.',
        invert: true,
      },
    ],
  },
  {
    id: 'C',
    title: 'Relações de Trabalho',
    questions: [
      {
        id: 'q13',
        text: '13. Meu (minha) superior(a) imediato(a) trata a equipe com respeito e justiça.',
        invert: true,
      },
      {
        id: 'q14',
        text: '14. Recebo feedbacks claros, construtivos e regulares sobre meu desempenho.',
        invert: true,
      },
      {
        id: 'q15',
        text: '15. Existe boa integração e cooperação entre os membros da minha equipe.',
        invert: true,
      },
      {
        id: 'q16',
        text: '16. Já fui vítima ou testemunhei situações de assédio moral (humilhações, perseguições, intimidações) no trabalho nos últimos 12 meses.',
      },
      {
        id: 'q17',
        text: '17. Já fui vítima ou testemunhei situações de discriminação (raça, gênero, idade, orientação sexual, deficiência, religião) no trabalho.',
      },
      {
        id: 'q18',
        text: '18. Conflitos interpessoais são frequentes e não são adequadamente gerenciados pela liderança.',
      },
    ],
  },
  {
    id: 'D',
    title: 'Reconhecimento e Recompensa',
    questions: [
      {
        id: 'q19',
        text: '19. Meu trabalho é reconhecido e valorizado pela minha chefia e pela organização.',
        invert: true,
      },
      {
        id: 'q20',
        text: '20. As oportunidades de crescimento profissional (promoções, novas funções) são claras e acessíveis.',
        invert: true,
      },
      {
        id: 'q21',
        text: '21. Considero que minha remuneração é compatível com a responsabilidade e a complexidade do meu cargo.',
        invert: true,
      },
      {
        id: 'q22',
        text: '22. As recompensas e benefícios oferecidos pela empresa são distribuídos de forma justa entre os colaboradores.',
        invert: true,
      },
      {
        id: 'q23',
        text: '23. Sinto que meu esforço extra (horas adicionais, projetos especiais) é devidamente reconhecido.',
        invert: true,
      },
    ],
  },
  {
    id: 'E',
    title: 'Equilíbrio Trabalho-Vida',
    questions: [
      {
        id: 'q24',
        text: '24. Minha jornada de trabalho permite que eu tenha tempo suficiente para família, lazer e cuidados pessoais.',
        invert: true,
      },
      {
        id: 'q25',
        text: '25. A organização oferece opções de flexibilidade (horário flexível, trabalho remoto) que facilitam o equilíbrio.',
        invert: true,
      },
      {
        id: 'q26',
        text: '26. Com frequência, levo trabalho para casa ou respondo a mensagens profissionais fora do horário de expediente.',
      },
      {
        id: 'q27',
        text: '27. Meus períodos de férias e descanso são respeitados, sem interrupções ou cobranças durante esses intervalos.',
        invert: true,
      },
      {
        id: 'q28',
        text: '28. A cultura da empresa desencoraja o excesso de horas extras e a sobrecarga habitual.',
        invert: true,
      },
    ],
  },
  {
    id: 'F',
    title: 'Saúde Mental e Bem-Estar',
    questions: [
      {
        id: 'q29',
        text: '29. Nos últimos seis meses, tenho me sentido frequentemente cansado(a) e sem energia para realizar minhas atividades.',
      },
      {
        id: 'q30',
        text: '30. Sinto-me tenso(a), irritado(a) ou ansioso(a) com frequência por causa do trabalho.',
      },
      {
        id: 'q31',
        text: '31. Tenho dificuldade para dormir ou acordo várias vezes durante a noite pensando em questões do trabalho.',
      },
      {
        id: 'q32',
        text: '32. Já apresentei sintomas físicos (dores de cabeça, dores musculares, gastrite, palpitações) que atribuo ao estresse no trabalho.',
      },
      {
        id: 'q33',
        text: '33. Sinto-me desinteressado(a) ou desmotivado(a) em relação ao trabalho que realizo.',
      },
      {
        id: 'q34',
        text: '34. A empresa disponibiliza recursos de apoio à saúde mental (programa de acolhimento, psicólogo, canais de escuta).',
        invert: true,
      },
    ],
  },
  {
    id: 'G',
    title: 'Comunicação e Participação',
    questions: [
      {
        id: 'q35',
        text: '35. As informações sobre mudanças, metas e decisões da empresa são comunicadas de forma clara e tempestiva.',
        invert: true,
      },
      {
        id: 'q36',
        text: '36. Tenho canais adequados para dar sugestões, fazer críticas ou relatar problemas sem medo de retaliação.',
        invert: true,
      },
      {
        id: 'q37',
        text: '37. Meu ponto de vista é considerado nas decisões que afetam minha rotina de trabalho.',
        invert: true,
      },
      {
        id: 'q38',
        text: '38. A comunicação entre os diferentes níveis hierárquicos é aberta e fluida.',
        invert: true,
      },
      {
        id: 'q39',
        text: '39. As reuniões de equipe são produtivas e permitem a participação ativa de todos.',
        invert: true,
      },
    ],
  },
  {
    id: 'H',
    title: 'Mudanças Organizacionais',
    questions: [
      {
        id: 'q40',
        text: '40. Sinto-me seguro(a) quanto à manutenção do meu emprego nos próximos meses.',
        invert: true,
      },
      {
        id: 'q41',
        text: '41. Quando ocorrem mudanças organizacionais (reestruturações, novas tecnologias, alteração de processos), sou informado(a) com antecedência e preparado(a) para elas.',
        invert: true,
      },
      {
        id: 'q42',
        text: '42. A organização oferece treinamentos e capacitações adequados para acompanhar as transformações do trabalho.',
        invert: true,
      },
      {
        id: 'q43',
        text: '43. As mudanças são implementadas de forma gradual, com participação dos trabalhadores afetados.',
        invert: true,
      },
      {
        id: 'q44',
        text: '44. Sinto que meu futuro profissional na empresa é incerto e isso me causa preocupação constante.',
      },
      {
        id: 'q45',
        text: '45. A empresa demonstra preocupação genuína com o bem-estar dos funcionários durante processos de reestruturação.',
        invert: true,
      },
    ],
  },
]

export function getRiskLevelKey(score: number): 'baixo' | 'moderado' | 'alto' | 'critico' {
  if (score <= 1.8) return 'baixo'
  if (score <= 2.6) return 'moderado'
  if (score <= 3.4) return 'alto'
  return 'critico'
}

export const PSYCHO_FEEDBACK: Record<
  string,
  Record<'baixo' | 'moderado' | 'alto' | 'critico', { diagnostico: string; mitigacao: string[] }>
> = {
  A: {
    baixo: {
      diagnostico: 'Excelente clareza nas tarefas, ritmo adequado e boa autonomia.',
      mitigacao: [
        'Manter práticas atuais de alinhamento de tarefas.',
        'Incentivar o compartilhamento de métodos de trabalho eficientes com a equipe.',
      ],
    },
    moderado: {
      diagnostico:
        'Algumas ambiguidades nas tarefas ou pressão ocasional para cumprimento de prazos.',
      mitigacao: [
        'Revisar a distribuição de demandas periódicas.',
        'Definir expectativas e prioridades de forma mais clara.',
      ],
    },
    alto: {
      diagnostico: 'Frequente sobrecarga, ritmo intenso e pouca autonomia para o colaborador.',
      mitigacao: [
        'Realizar mapeamento de processos para eliminar gargalos.',
        'Redistribuir tarefas e repensar prazos de entrega.',
        'Treinar lideranças em técnicas de delegação.',
      ],
    },
    critico: {
      diagnostico: 'Sobrecarga extrema, metas inatingíveis e ritmo altamente exaustivo.',
      mitigacao: [
        'Intervenção imediata nas metas estabelecidas.',
        'Adequar o quadro de pessoal às demandas do setor.',
        'Promover revisão ergonômica da organização do trabalho.',
      ],
    },
  },
  B: {
    baixo: {
      diagnostico: 'Condições físicas, equipamentos e ergonomia adequados e seguros.',
      mitigacao: [
        'Manter as manutenções preventivas em dia.',
        'Continuar incentivando o uso das pausas regulares.',
      ],
    },
    moderado: {
      diagnostico: 'Pequenas inadequações físicas ou falta pontual de recursos ideais.',
      mitigacao: [
        'Realizar levantamento de necessidades de equipamentos.',
        'Incentivar a organização e pequenos ajustes ergonômicos no posto de trabalho.',
      ],
    },
    alto: {
      diagnostico:
        'Problemas ergonômicos relevantes, ambiente desconfortável ou falhas na segurança.',
      mitigacao: [
        'Efetuar Análise Ergonômica do Trabalho (AET) no setor.',
        'Atualizar ou substituir equipamentos e mobiliários inadequados.',
        'Reforçar a fiscalização de segurança e pausas.',
      ],
    },
    critico: {
      diagnostico:
        'Riscos iminentes à integridade física, ausência de ferramentas básicas e ambiente hostil.',
      mitigacao: [
        'Paralisação preventiva para correção de riscos graves, se necessário.',
        'Investimento emergencial em infraestrutura e mobiliário.',
        'Implementação rigorosa de políticas de segurança física.',
      ],
    },
  },
  C: {
    baixo: {
      diagnostico: 'Relações interpessoais saudáveis, respeito mútuo e boa cooperação.',
      mitigacao: [
        'Promover momentos de integração e celebração em equipe.',
        'Reconhecer publicamente a colaboração entre os membros.',
      ],
    },
    moderado: {
      diagnostico: 'Alguns ruídos de comunicação, conflitos pontuais ou falta de feedback regular.',
      mitigacao: [
        'Implementar rotina de feedbacks construtivos.',
        'Estimular o diálogo aberto e mediação de pequenos conflitos.',
      ],
    },
    alto: {
      diagnostico:
        'Conflitos interpessoais frequentes, falta de apoio da liderança e indícios de hostilidade.',
      mitigacao: [
        'Treinamento de lideranças em gestão de conflitos e empatia.',
        'Abrir canais seguros para mediação e escuta ativa.',
        'Monitorar o clima da equipe de perto.',
      ],
    },
    critico: {
      diagnostico:
        'Ambiente tóxico, com fortes indícios de assédio moral, discriminação ou isolamento.',
      mitigacao: [
        'Abertura imediata de canal de denúncias confidencial.',
        'Investigação profunda de possíveis casos de assédio ou discriminação.',
        'Ação corretiva/disciplinar e programa intensivo de conscientização.',
      ],
    },
  },
  D: {
    baixo: {
      diagnostico: 'O colaborador sente-se valorizado, com remuneração e benefícios justos.',
      mitigacao: [
        'Manter a transparência sobre critérios de reconhecimento.',
        'Continuar oferecendo oportunidades de crescimento e desenvolvimento.',
      ],
    },
    moderado: {
      diagnostico:
        'Percepção de reconhecimento irregular ou dúvidas sobre oportunidades de crescimento.',
      mitigacao: [
        'Clarificar os planos de carreira e critérios de promoção.',
        'Criar programas de reconhecimento não-financeiro (elogios, prêmios simbólicos).',
      ],
    },
    alto: {
      diagnostico:
        'Forte descontentamento com a falta de reconhecimento e sentimento de injustiça.',
      mitigacao: [
        'Revisar a política de remuneração e benefícios frente ao mercado.',
        'Implementar avaliações de desempenho transparentes.',
        'Garantir que esforços extras sejam devidamente compensados.',
      ],
    },
    critico: {
      diagnostico: 'Completa desvalorização, sensação de exploração e estagnação profissional.',
      mitigacao: [
        'Reestruturação profunda da política de cargos e salários.',
        'Intervenção da diretoria para alinhar práticas de reconhecimento em toda a gestão.',
        'Criar plano de ação de valorização imediata.',
      ],
    },
  },
  E: {
    baixo: {
      diagnostico: 'Excelente equilíbrio entre a vida pessoal e as exigências do trabalho.',
      mitigacao: [
        'Continuar respeitando o direito à desconexão.',
        'Apoiar o uso de políticas de flexibilidade quando aplicável.',
      ],
    },
    moderado: {
      diagnostico:
        'Ocasional invasão do trabalho na vida pessoal ou dificuldade pontual de desconexão.',
      mitigacao: [
        'Orientar lideranças a não acionarem a equipe fora do expediente.',
        'Incentivar o planejamento adequado das férias e descansos.',
      ],
    },
    alto: {
      diagnostico:
        'Desequilíbrio significativo, horas extras frequentes e trabalho levado para casa.',
      mitigacao: [
        'Criar política estrita de limitação de horas extras.',
        'Restringir exigência de respostas fora do horário comercial.',
        'Rever a capacidade operacional da equipe.',
      ],
    },
    critico: {
      diagnostico:
        'Esgotamento total, ausência de limites entre vida pessoal e trabalho, cultura impositiva.',
      mitigacao: [
        'Proibir terminantemente a cobrança de tarefas fora do horário de trabalho.',
        'Auditoria imediata nas cargas horárias.',
        'Implementação de medidas obrigatórias de qualidade de vida e desconexão.',
      ],
    },
  },
  F: {
    baixo: {
      diagnostico: 'Boa disposição física e mental, sem sinais relevantes de estresse ocupacional.',
      mitigacao: [
        'Manter o acesso a recursos de promoção do bem-estar.',
        'Incentivar atividades físicas e cuidados preventivos de saúde.',
      ],
    },
    moderado: {
      diagnostico: 'Sinais leves de cansaço, tensão ou desmotivação relacionados ao trabalho.',
      mitigacao: [
        'Oferecer palestras e workshops sobre saúde mental e resiliência.',
        'Proporcionar momentos de descompressão durante o expediente.',
      ],
    },
    alto: {
      diagnostico: 'Sintomas evidentes de estresse, ansiedade ou desgaste físico persistente.',
      mitigacao: [
        'Oferecer ou facilitar acesso a apoio psicológico profissional.',
        'Avaliar a necessidade de readequação temporária de funções.',
        'Acompanhamento direto do SESMT ou Recursos Humanos.',
      ],
    },
    critico: {
      diagnostico:
        'Alto risco de Burnout, sintomas graves de exaustão emocional, insônia e desinteresse total.',
      mitigacao: [
        'Avaliação médica imediata para possível afastamento e tratamento.',
        'Apoio integral à saúde do colaborador através de rede credenciada.',
        'Investigação profunda e correção das causas raízes de estresse no setor.',
      ],
    },
  },
  G: {
    baixo: {
      diagnostico: 'Comunicação fluida, transparente e ambiente altamente participativo.',
      mitigacao: [
        'Manter as reuniões de equipe frequentes e eficientes.',
        'Garantir que os canais de sugestão continuem ativos e valorizados.',
      ],
    },
    moderado: {
      diagnostico:
        'Falhas eventuais de comunicação ou participação limitada em decisões departamentais.',
      mitigacao: [
        'Melhorar a periodicidade dos comunicados institucionais.',
        'Encorajar ativamente os colaboradores a expressarem opiniões construtivas.',
      ],
    },
    alto: {
      diagnostico: 'Comunicação deficiente, falta de voz e sensação de exclusão das decisões.',
      mitigacao: [
        'Estabelecer rotinas claras de "Town Halls" ou reuniões de alinhamento com a diretoria.',
        'Criar comitês representativos para ouvir a base.',
        'Garantir retorno formal e prático às sugestões dos funcionários.',
      ],
    },
    critico: {
      diagnostico:
        'Comunicação estritamente unilateral, cultura de silêncio por medo de retaliação e ocultação de informações.',
      mitigacao: [
        'Mudança urgente na postura da gestão e liderança.',
        'Implementar canais de escuta anônima auditados por terceiros.',
        'Treinamento obrigatório de gestores em transparência e escuta ativa.',
      ],
    },
  },
  H: {
    baixo: {
      diagnostico:
        'Segurança no emprego e boa percepção sobre a gestão das mudanças organizacionais.',
      mitigacao: [
        'Continuar comunicando com antecedência qualquer alteração de rota ou ferramenta.',
        'Manter a oferta contínua de treinamentos de atualização.',
      ],
    },
    moderado: {
      diagnostico:
        'Certa apreensão com o futuro ou necessidade de melhor preparo frente a inovações.',
      mitigacao: [
        'Reforçar comunicados sobre a estabilidade e os objetivos de longo prazo da empresa.',
        'Aprimorar a capacitação técnica prévia à implementação de novos processos.',
      ],
    },
    alto: {
      diagnostico:
        'Insegurança acentuada, mudanças impostas de forma abrupta e sensação de defasagem.',
      mitigacao: [
        'Criar um plano estruturado de Gestão de Mudanças (Change Management).',
        'Promover diálogos frequentes e abertos sobre o futuro do mercado e da empresa.',
        'Oferecer suporte e tempo adequados de transição para novas tecnologias.',
      ],
    },
    critico: {
      diagnostico:
        'Pânico generalizado quanto à manutenção do emprego, ameaças constantes e mudanças caóticas.',
      mitigacao: [
        'Ação imediata da Alta Direção para restaurar o mínimo de confiança e segurança psicológica.',
        'Transparência radical sobre a real situação e motivos das reestruturações.',
        'Fornecer suporte direto aos times impactados durante e após a transição.',
      ],
    },
  },
}

export function getPsychoRisk(score: number) {
  if (score <= 1.8)
    return {
      label: 'Baixo Risco',
      color: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-200',
    }
  if (score <= 2.6)
    return {
      label: 'Risco Moderado',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      border: 'border-yellow-200',
    }
  if (score <= 3.4)
    return {
      label: 'Risco Alto',
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      border: 'border-orange-200',
    }
  return {
    label: 'Risco Crítico',
    color: 'text-red-600',
    bg: 'bg-red-100',
    border: 'border-red-200',
  }
}

export function calculatePsychoScores(respostas: Record<string, number | string>) {
  const dimensionScores: Record<string, number> = {}
  let totalScore = 0
  let totalQuestions = 0

  PSYCHO_DIMENSIONS.forEach((dim) => {
    let dimSum = 0
    dim.questions.forEach((q) => {
      let val = Number(respostas[q.id]) || 0
      if (val > 0) {
        if (q.invert) {
          val = 6 - val // Invert score so higher = higher risk
        }
        dimSum += val
        totalScore += val
        totalQuestions++
      }
    })
    dimensionScores[dim.id] =
      dim.questions.length > 0 ? Number((dimSum / dim.questions.length).toFixed(2)) : 0
  })

  const pontuacao_geral = totalQuestions > 0 ? Number((totalScore / totalQuestions).toFixed(2)) : 0

  return { dimensionScores, pontuacao_geral }
}
