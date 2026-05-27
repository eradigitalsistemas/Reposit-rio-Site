export const PSYCHO_DIMENSIONS = [
  {
    id: 'A',
    title: 'Organização do Trabalho',
    questions: [
      {
        id: 'q1',
        text: '1. Minhas tarefas são claramente definidas e sei exatamente o que se espera de mim no dia a dia.',
      },
      {
        id: 'q2',
        text: '2. A quantidade de trabalho que recebo é compatível com o tempo disponível para realizá-lo.',
      },
      {
        id: 'q3',
        text: '3. Tenho autonomia para decidir a ordem e o método de execução das minhas tarefas.',
      },
      {
        id: 'q4',
        text: '4. O ritmo de trabalho é intenso e frequentemente me sinto pressionado(a) a cumprir prazos apertados.',
        negative: true,
      },
      {
        id: 'q5',
        text: '5. Existe sobrecarga de trabalho devido a metas excessivas ou impossíveis de alcançar.',
        negative: true,
      },
      {
        id: 'q6',
        text: '6. Posso interromper meu trabalho quando necessário (para descanso, necessidades pessoais, etc.) sem sofrer consequências negativas.',
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
      },
      {
        id: 'q8',
        text: '8. Disponho de todos os equipamentos, ferramentas e materiais necessários para executar minhas funções com qualidade e segurança.',
      },
      {
        id: 'q9',
        text: '9. Sinto que o mobiliário e o posto de trabalho são adequados ergonomicamente (conforme NR-17).',
      },
      {
        id: 'q10',
        text: '10. A organização realiza avaliações e ajustes periódicos das condições físicas e ergonômicas do ambiente de trabalho.',
      },
      {
        id: 'q11',
        text: '11. Sinto-me seguro(a) fisicamente no meu local de trabalho (riscos de acidentes, violência externa, etc.).',
      },
      {
        id: 'q12',
        text: '12. As pausas e intervalos previstos são respeitados e efetivamente usufruídos pela equipe.',
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
      },
      {
        id: 'q14',
        text: '14. Recebo feedbacks claros, construtivos e regulares sobre meu desempenho.',
      },
      {
        id: 'q15',
        text: '15. Existe boa integração e cooperação entre os membros da minha equipe.',
      },
      {
        id: 'q16',
        text: '16. Já fui vítima ou testemunhei situações de assédio moral (humilhações, perseguições, intimidações) no trabalho nos últimos 12 meses.',
        negative: true,
      },
      {
        id: 'q17',
        text: '17. Já fui vítima ou testemunhei situações de discriminação (raça, gênero, idade, orientação sexual, deficiência, religião) no trabalho.',
        negative: true,
      },
      {
        id: 'q18',
        text: '18. Conflitos interpessoais são frequentes e não são adequadamente gerenciados pela liderança.',
        negative: true,
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
      },
      {
        id: 'q20',
        text: '20. As oportunidades de crescimento profissional (promoções, novas funções) são claras e acessíveis.',
      },
      {
        id: 'q21',
        text: '21. Considero que minha remuneração é compatível com a responsabilidade e a complexidade do meu cargo.',
      },
      {
        id: 'q22',
        text: '22. As recompensas e benefícios oferecidos pela empresa são distribuídos de forma justa entre os colaboradores.',
      },
      {
        id: 'q23',
        text: '23. Sinto que meu esforço extra (horas adicionais, projetos especiais) é devidamente reconhecido.',
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
      },
      {
        id: 'q25',
        text: '25. A organização oferece opções de flexibilidade (horário flexível, trabalho remoto) que facilitam o equilíbrio.',
      },
      {
        id: 'q26',
        text: '26. Com frequência, levo trabalho para casa ou respondo a mensagens profissionais fora do horário de expediente.',
        negative: true,
      },
      {
        id: 'q27',
        text: '27. Meus períodos de férias e descanso são respeitados, sem interrupções ou cobranças durante esses intervalos.',
      },
      {
        id: 'q28',
        text: '28. A cultura da empresa desencoraja o excesso de horas extras e a sobrecarga habitual.',
        negative: true,
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
        negative: true,
      },
      {
        id: 'q30',
        text: '30. Sinto-me tenso(a), irritado(a) ou ansioso(a) com frequência por causa do trabalho.',
        negative: true,
      },
      {
        id: 'q31',
        text: '31. Tenho dificuldade para dormir ou acordo várias vezes durante a noite pensando em questões do trabalho.',
        negative: true,
      },
      {
        id: 'q32',
        text: '32. Já apresentei sintomas físicos (dores de cabeça, dores musculares, gastrite, palpitações) que atribuo ao estresse no trabalho.',
        negative: true,
      },
      {
        id: 'q33',
        text: '33. Sinto-me desinteressado(a) ou desmotivado(a) em relação ao trabalho que realizo.',
        negative: true,
      },
      {
        id: 'q34',
        text: '34. A empresa disponibiliza recursos de apoio à saúde mental (programa de acolhimento, psicólogo, canais de escuta).',
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
      },
      {
        id: 'q36',
        text: '36. Tenho canais adequados para dar sugestões, fazer críticas ou relatar problemas sem medo de retaliação.',
      },
      {
        id: 'q37',
        text: '37. Meu ponto de vista é considerado nas decisões que afetam minha rotina de trabalho.',
      },
      {
        id: 'q38',
        text: '38. A comunicação entre os diferentes níveis hierárquicos é aberta e fluida.',
      },
      {
        id: 'q39',
        text: '39. As reuniões de equipe são produtivas e permitem a participação ativa de todos.',
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
      },
      {
        id: 'q41',
        text: '41. Quando ocorrem mudanças organizacionais (reestruturações, novas tecnologias, alteração de processos), sou informado(a) com antecedência e preparado(a) para elas.',
      },
      {
        id: 'q42',
        text: '42. A organização oferece treinamentos e capacitações adequados para acompanhar as transformações do trabalho.',
      },
      {
        id: 'q43',
        text: '43. As mudanças são implementadas de forma gradual, com participação dos trabalhadores afetados.',
      },
      {
        id: 'q44',
        text: '44. Sinto que meu futuro profissional na empresa é incerto e isso me causa preocupação constante.',
        negative: true,
      },
      {
        id: 'q45',
        text: '45. A empresa demonstra preocupação genuína com o bem-estar dos funcionários durante processos de reestruturação.',
      },
    ],
  },
]

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

export function calculatePsychoScores(respostas: Record<string, number>) {
  const dimensionScores: Record<string, number> = {}
  let totalScore = 0
  let totalQuestions = 0

  PSYCHO_DIMENSIONS.forEach((dim) => {
    let dimSum = 0
    dim.questions.forEach((q) => {
      let val = Number(respostas[q.id]) || 0
      if (val > 0) {
        if (q.negative) val = 6 - val
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
