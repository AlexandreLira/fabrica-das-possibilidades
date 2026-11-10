import {
  countAlternatives,
  countCombinations,
  minimumGuaranteedOccupancy,
} from '../domain/math/counting';
import type { ChallengeDefinition } from './sectors';

export type AdditionRouteId = 'local' | 'express';

export interface AdditionChallengeDefinition extends ChallengeDefinition {
  groups: readonly {
    id: AdditionRouteId;
    name: string;
    count: number;
    optionsLabel: string;
  }[];
}

const groups = [
  { id: 'local', name: 'Rota local', count: 3, optionsLabel: '3 veículos disponíveis' },
  { id: 'express', name: 'Rota expressa', count: 4, optionsLabel: '4 veículos disponíveis' },
] as const;

export const additionRouteChallenge: AdditionChallengeDefinition = {
  id: 'adicao-1',
  principle: 'addition',
  title: 'Pedido com rota alternativa',
  sectorLabel: 'Setor 01 — Fase demonstrativa',
  introduction: 'Um pedido precisa sair da fábrica! Vamos escolher um veículo da rota local OU da expressa. Toque nas duas rotas para conhecer as opções.',
  question: 'Quantas opções de envio existem para o pedido?',
  tutorial: [
    'Toque nas duas rotas para revelar todos os veículos.',
    'Escolha uma resposta e confirme. Se precisar, peça uma dica.',
  ],
  groups,
  answers: [6, 7, 12],
  correctAnswer: countAlternatives(groups.map((group) => group.count)),
  hint: 'O pedido usa apenas uma das rotas. Conte as opções de um grupo junto com as do outro.',
  feedback: {
    6: 'Confira os dois grupos: são 3 veículos em uma rota e 4 na outra.',
    12: 'Multiplicar contaria pares de veículos. Aqui escolhemos apenas um veículo, de uma rota ou da outra.',
  },
  successExplanation: 'Isso! Como os grupos são distintos e escolhemos uma opção de um OU de outro, somamos: 3 + 4 = 7 possibilidades.',
};

export type RobotBodyId = 'ciano' | 'amarela' | 'coral';
export type RobotAntennaId = 'haste' | 'dupla';

export interface MultiplicationChallengeDefinition extends ChallengeDefinition {
  bodyOptions: readonly { id: RobotBodyId; name: string; color: string }[];
  antennaOptions: readonly { id: RobotAntennaId; name: string; symbol: string }[];
}

const bodyOptions = [
  { id: 'ciano', name: 'Carcaça ciano', color: '#71dfda' },
  { id: 'amarela', name: 'Carcaça amarela', color: '#f4c955' },
  { id: 'coral', name: 'Carcaça coral', color: '#ef7d72' },
] as const;

const antennaOptions = [
  { id: 'haste', name: 'Antena de haste', symbol: '│' },
  { id: 'dupla', name: 'Antena dupla', symbol: 'Y' },
] as const;

export const multiplicationRobotChallenge: MultiplicationChallengeDefinition = {
  id: 'multiplicacao-1',
  principle: 'multiplication',
  title: 'Monte o robô',
  sectorLabel: 'Setor 02 — Fase demonstrativa',
  introduction: 'Agora vamos montar robôs! Escolha uma carcaça E uma antena. Cada carcaça funciona com qualquer uma das antenas.',
  question: 'Quantos modelos diferentes podemos montar usando uma carcaça e uma antena?',
  tutorial: [
    'Escolha uma das três carcaças e uma das duas antenas.',
    'Observe a prévia, experimente combinações e depois responda ao desafio.',
  ],
  bodyOptions,
  antennaOptions,
  answers: [5, 6, 9],
  correctAnswer: countCombinations([bodyOptions.length, antennaOptions.length]),
  hint: 'Para cada uma das três carcaças, existem duas escolhas de antena.',
  feedback: {
    5: 'Somar conta peças disponíveis. Queremos contar os modelos formados por uma carcaça E uma antena.',
    9: 'Confira quantas antenas existem para cada carcaça: são duas, não três.',
  },
  successExplanation: 'Cada uma das 3 carcaças combina com 2 antenas: 3 × 2 = 6 modelos.',
};

export interface MultiplicationPracticeChallenge extends ChallengeDefinition {
  equation: string;
}

/** Quatro atividades complementares da fase de multiplicação. */
export const multiplicationPracticeChallenges: readonly MultiplicationPracticeChallenge[] = [
  {
    id: 'multiplicacao-2',
    principle: 'multiplication',
    title: 'Montagem de robôs',
    sectorLabel: 'Setor 02 — Atividade 02 de 05',
    introduction: 'A linha de montagem recebeu novas peças! Cada robô precisa de um corpo e de um conjunto de rodas. Todas as combinações são permitidas.',
    question: 'Existem 4 modelos de corpo e 3 conjuntos de rodas. Quantos robôs diferentes podem ser montados?',
    equation: '4 × 3',
    tutorial: [
      'Observe as duas etapas da montagem: escolher o corpo e escolher as rodas.',
      'Para cada modelo de corpo, podemos usar qualquer um dos três conjuntos de rodas.',
      'Marque a resposta e confirme para ver a explicação.',
    ],
    answers: [7, 12, 9, 16],
    correctAnswer: countCombinations([4, 3]),
    hint: 'Cada um dos 4 modelos de corpo pode ser combinado com os 3 conjuntos de rodas.',
    feedback: {
      7: 'Você somou as opções. Mas o robô precisa de um corpo E de rodas; as escolhas são combinadas.',
      9: 'Confira a quantidade de conjuntos de rodas: são 3 para cada um dos 4 corpos.',
      16: 'Observe que não há 4 opções de rodas para cada corpo. São 3 conjuntos de rodas.',
    },
    successExplanation: 'Multiplicamos porque cada robô precisa das duas escolhas: um corpo e um conjunto de rodas. Assim, 4 × 3 = 12 robôs diferentes.',
  },
  {
    id: 'multiplicacao-3',
    principle: 'multiplication',
    title: 'Personalização dos robôs',
    sectorLabel: 'Setor 02 — Atividade 03 de 05',
    introduction: 'Agora vamos personalizar os robôs! Escolha uma cor, uma antena e um modelo de braços. Todas as opções podem ser combinadas.',
    question: 'Há 3 cores, 2 tipos de antena e 2 modelos de braços. Quantos robôs diferentes podem ser criados?',
    equation: '3 × 2 × 2',
    tutorial: [
      'A personalização tem três etapas: cor, antena e braços.',
      'Escolhemos uma opção de cada etapa.',
      'Multiplique as quantidades das três etapas.',
    ],
    answers: [7, 10, 12, 14],
    correctAnswer: countCombinations([3, 2, 2]),
    hint: 'São três escolhas sucessivas. Multiplique 3 opções de cor por 2 antenas e por 2 modelos de braços.',
    feedback: {
      7: 'Não devemos somar as opções, pois o robô recebe uma escolha de cada categoria.',
      10: 'Confira se você multiplicou as três categorias, incluindo os dois modelos de braços.',
      14: 'Lembre-se de multiplicar as três etapas, não apenas duas delas.',
    },
    successExplanation: 'Como cada robô recebe uma cor, uma antena e um modelo de braços, multiplicamos as três quantidades: 3 × 2 × 2 = 12 personalizações diferentes.',
  },
  {
    id: 'multiplicacao-4',
    principle: 'multiplication',
    title: 'Caminhos da fábrica',
    sectorLabel: 'Setor 02 — Atividade 04 de 05',
    introduction: 'O robô precisa atravessar três setores para chegar à saída. Em cada setor, ele escolhe um caminho, e todas as escolhas podem ser combinadas.',
    question: 'No primeiro setor há 2 caminhos, no segundo há 3 e no terceiro há 2. Quantos trajetos completos diferentes existem?',
    equation: '2 × 3 × 2',
    tutorial: [
      'O trajeto passa pelos três setores, em sequência.',
      'Em cada setor, o robô escolhe exatamente um caminho.',
      'Multiplique as opções de todos os setores para contar os trajetos completos.',
    ],
    answers: [7, 10, 12, 14],
    correctAnswer: countCombinations([2, 3, 2]),
    hint: 'O robô precisa fazer uma escolha em cada setor: 2 opções, depois 3 e, por fim, 2.',
    feedback: {
      7: 'O robô precisa atravessar os três setores. Por isso, não somamos as opções.',
      10: 'Confira se você considerou as opções dos três setores na multiplicação.',
      14: 'Multiplique 2 pelo número de caminhos do segundo setor (3) e pelo último (2).',
    },
    successExplanation: 'Como o trajeto exige uma escolha em cada um dos três setores, aplicamos o princípio da multiplicação: 2 × 3 × 2 = 12 trajetos completos.',
  },
  {
    id: 'multiplicacao-5',
    principle: 'multiplication',
    title: 'Robô completo',
    sectorLabel: 'Setor 02 — Atividade 05 de 05',
    introduction: 'Chegou o desafio final! A fábrica precisa combinar quatro partes para construir robôs especiais. Todas as opções são compatíveis entre si.',
    question: 'Existem 3 cabeças, 3 corpos, 2 modelos de braços e 2 tipos de sensores. Quantos robôs diferentes podem ser construídos?',
    equation: '3 × 3 × 2 × 2',
    tutorial: [
      'Identifique as quatro etapas de montagem: cabeça, corpo, braços e sensores.',
      'Cada robô recebe exatamente uma opção de cada etapa.',
      'Multiplique as quatro quantidades para encontrar o total de modelos.',
    ],
    answers: [10, 18, 24, 36],
    correctAnswer: countCombinations([3, 3, 2, 2]),
    hint: 'São quatro etapas independentes. Faça 3 × 3 × 2 × 2.',
    feedback: {
      10: 'Você considerou poucas combinações. É necessário incluir as quatro partes do robô.',
      18: 'Confira se multiplicou também pelas duas opções de braços e pelas duas de sensores.',
      24: 'Revise as duas primeiras etapas: existem 3 cabeças e 3 corpos, além das opções de braços e sensores.',
    },
    successExplanation: 'Cada robô é formado por uma cabeça, um corpo, um modelo de braços e um sensor. Multiplicamos as quatro etapas: 3 × 3 × 2 × 2 = 36 modelos diferentes.',
  },
];

export interface PigeonholeChallengeDefinition extends ChallengeDefinition {
  items: number;
  boxes: number;
}

export const pigeonholeStorageChallenge: PigeonholeChallengeDefinition = {
  id: 'casas-de-pombo-1',
  principle: 'pigeonhole',
  title: 'Organize o depósito',
  sectorLabel: 'Setor 03 — Fase demonstrativa',
  introduction: 'Temos 7 peças e 3 caixas. Toque nas caixas para guardar as peças e observe o que acontece.',
  question: 'Independentemente de como você distribuir as peças, qual é o menor número que podemos garantir que alguma caixa terá, pelo menos?',
  tutorial: [
    'Toque em uma caixa para guardar nela a próxima peça.',
    'Distribua as sete peças. Você pode reiniciar antes de responder.',
  ],
  items: 7,
  boxes: 3,
  answers: [2, 3, 7],
  correctAnswer: minimumGuaranteedOccupancy(7, 3),
  hint: 'Se cada caixa tivesse no máximo 2 peças, caberiam apenas 6. E a peça que sobrou?',
  feedback: {
    2: 'Três caixas com no máximo 2 peças guardariam apenas 6. Precisamos guardar 7.',
    7: 'Uma caixa pode receber todas as peças, mas isso não acontece em toda distribuição. Procure a menor quantidade inevitável.',
  },
  successExplanation: 'Alguma caixa terá pelo menos 3 peças! Com apenas 2 em cada caixa, guardaríamos 6. A sétima exige que uma caixa tenha 3 ou mais.',
};

export const demoChallenges = [
  additionRouteChallenge,
  multiplicationRobotChallenge,
  pigeonholeStorageChallenge,
] as const;
