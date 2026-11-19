import {
  countAlternatives,
  countCombinations,
  minimumGuaranteedOccupancy,
} from '../domain/math/counting';
import type { ChallengeDefinition, ChallengeId } from './sectors';

export interface AdditionChallengeDefinition extends ChallengeDefinition {
  principle: 'addition';
  equation: string;
  groups: readonly {
    id: string;
    name: string;
    count: number;
    optionsLabel: string;
  }[];
}

const additionRouteGroups = [
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
  equation: '3 + 4 = ?',
  groups: additionRouteGroups,
  answers: [6, 7, 12],
  correctAnswer: countAlternatives(additionRouteGroups.map((group) => group.count)),
  hint: 'O pedido usa apenas uma das rotas. Conte as opções de um grupo junto com as do outro.',
  feedback: {
    6: 'Confira os dois grupos: são 3 veículos em uma rota e 4 na outra.',
    12: 'Multiplicar contaria pares de veículos. Aqui escolhemos apenas um veículo, de uma rota ou da outra.',
  },
  successExplanation: 'Isso! Como os grupos são distintos e escolhemos uma opção de um OU de outro, somamos: 3 + 4 = 7 possibilidades.',
};

export const additionSeparationChallenge: AdditionChallengeDefinition = {
  id: 'adicao-2',
  principle: 'addition',
  title: 'Separação de Produtos',
  sectorLabel: 'Setor 01 — Fase 2',
  introduction: 'Vamos organizar os produtos da fábrica. Examine os dois grupos e conte quantas opções existem ao todo.',
  question: 'Quantas opções de produtos existem ao todo?',
  tutorial: ['Examine os produtos de cada grupo.', 'Some as quantidades e escolha a resposta correta.'],
  equation: '4 + 3 = ?',
  groups: [
    { id: 'vermelhos', name: 'Produtos vermelhos', count: 4, optionsLabel: '4 caixas' },
    { id: 'azuis', name: 'Produtos azuis', count: 3, optionsLabel: '3 caixas' },
  ],
  answers: [5, 6, 7, 8],
  correctAnswer: countAlternatives([4, 3]),
  hint: 'Conte os produtos de cada grupo separadamente e depois some os resultados.',
  feedback: {
    5: 'Confira novamente a quantidade de produtos.',
    6: 'Você pode ter esquecido de contar alguma caixa.',
    8: 'Revise a soma dos dois grupos.',
  },
  successExplanation: 'Muito bem! 4 produtos vermelhos + 3 produtos azuis = 7 opções. Como são alternativas distintas, somamos as quantidades.',
};

export const additionMaterialsChallenge: AdditionChallengeDefinition = {
  id: 'adicao-3',
  principle: 'addition',
  title: 'Escolha de Materiais',
  sectorLabel: 'Setor 01 — Fase 3',
  introduction: 'O setor precisa de materiais para continuar funcionando. Examine as três categorias e descubra quantas opções estão disponíveis.',
  question: 'Quantas opções de materiais estão disponíveis?',
  tutorial: ['Examine as três categorias de materiais.', 'Some as quantidades de todas as categorias.'],
  equation: '5 + 4 + 3 = ?',
  groups: [
    { id: 'ferramentas', name: 'Ferramentas', count: 5, optionsLabel: '5 ferramentas' },
    { id: 'metal', name: 'Peças metálicas', count: 4, optionsLabel: '4 peças' },
    { id: 'eletronicos', name: 'Componentes eletrônicos', count: 3, optionsLabel: '3 componentes' },
  ],
  answers: [10, 11, 12, 15],
  correctAnswer: countAlternatives([5, 4, 3]),
  hint: 'Não esqueça de incluir todos os três grupos na operação.',
  feedback: {
    10: 'Confira se você considerou os três grupos.',
    11: 'Revise a soma dos materiais.',
    15: 'Some as quantidades, sem multiplicá-las.',
  },
  successExplanation: 'Excelente! 5 ferramentas + 4 peças metálicas + 3 componentes eletrônicos = 12 opções.',
};

export interface MultiplicationOption {
  id: string;
  name: string;
  color?: string;
  symbol?: string;
}

export interface MultiplicationStage {
  id: string;
  name: string;
  options: readonly MultiplicationOption[];
}

export interface MultiplicationChallengeDefinition extends ChallengeDefinition {
  principle: 'multiplication';
  visual: 'robot' | 'routes';
  equation: string;
  stages: readonly MultiplicationStage[];
}

const robotStages = [
  {
    id: 'carcaca', name: 'Carcaça', options: [
      { id: 'ciano', name: 'Carcaça ciano', color: '#71dfda' },
      { id: 'amarela', name: 'Carcaça amarela', color: '#f4c955' },
      { id: 'coral', name: 'Carcaça coral', color: '#ef7d72' },
    ],
  },
  {
    id: 'antena', name: 'Antena', options: [
      { id: 'haste', name: 'Antena de haste', symbol: '│' },
      { id: 'dupla', name: 'Antena dupla', symbol: 'Y' },
    ],
  },
] as const;

export const multiplicationRobotChallenge: MultiplicationChallengeDefinition = {
  id: 'multiplicacao-1',
  principle: 'multiplication',
  visual: 'robot',
  title: 'Monte o robô',
  sectorLabel: 'Setor 02 — Fase demonstrativa',
  introduction: 'Agora vamos montar robôs! Escolha uma carcaça E uma antena. Cada carcaça funciona com qualquer uma das antenas.',
  question: 'Quantos modelos diferentes podemos montar usando uma carcaça e uma antena?',
  tutorial: [
    'Escolha uma das três carcaças e uma das duas antenas.',
    'Observe a prévia, experimente combinações e depois responda ao desafio.',
  ],
  equation: '3 × 2 = ?',
  stages: robotStages,
  answers: [5, 6, 9],
  correctAnswer: countCombinations(robotStages.map((stage) => stage.options.length)),
  hint: 'Para cada uma das três carcaças, existem duas escolhas de antena.',
  feedback: {
    5: 'Somar conta peças disponíveis. Queremos contar os modelos formados por uma carcaça E uma antena.',
    9: 'Confira quantas antenas existem para cada carcaça: são duas, não três.',
  },
  successExplanation: 'Cada uma das 3 carcaças combina com 2 antenas: 3 × 2 = 6 modelos.',
};

const assemblyStages = [
  {
    id: 'corpo', name: 'Modelo de corpo', options: [
      { id: 'corpo-1', name: 'Corpo 1', color: '#71dfda' },
      { id: 'corpo-2', name: 'Corpo 2', color: '#f4c955' },
      { id: 'corpo-3', name: 'Corpo 3', color: '#ef7d72' },
      { id: 'corpo-4', name: 'Corpo 4', color: '#b6a3eb' },
    ],
  },
  {
    id: 'rodas', name: 'Modelo de rodas', options: [
      { id: 'rodas-1', name: 'Rodas 1' },
      { id: 'rodas-2', name: 'Rodas 2' },
      { id: 'rodas-3', name: 'Rodas 3' },
    ],
  },
] as const;

export const multiplicationAssemblyChallenge: MultiplicationChallengeDefinition = {
  id: 'multiplicacao-2',
  principle: 'multiplication',
  visual: 'robot',
  title: 'Montagem de Robôs',
  sectorLabel: 'Setor 02 — Fase 2',
  introduction: 'A fábrica tem diferentes corpos e rodas para montar robôs. Escolha uma opção de cada tipo e conte todas as combinações possíveis.',
  question: 'Quantos robôs diferentes podem ser montados?',
  tutorial: ['Escolha um modelo de corpo.', 'Escolha um modelo de rodas e descubra quantas combinações existem.'],
  equation: '4 × 3 = ?',
  stages: assemblyStages,
  answers: [7, 9, 12, 16],
  correctAnswer: countCombinations(assemblyStages.map((stage) => stage.options.length)),
  hint: 'Para cada modelo de corpo, existem três possibilidades de rodas.',
  feedback: {
    7: 'Não some as quantidades. Cada corpo pode ser combinado com todos os modelos de rodas.',
    9: 'Confira as quantidades disponíveis: são 4 modelos de corpo e 3 modelos de rodas.',
    16: 'Pense em quantas opções de rodas existem para cada modelo de corpo.',
  },
  successExplanation: 'Cada modelo de corpo pode ser combinado com qualquer um dos modelos de rodas: 4 × 3 = 12 robôs.',
};

const routeStages = [
  { id: 'setor-1', name: 'Setor 1', options: [{ id: 'rota-1a', name: 'Caminho A' }, { id: 'rota-1b', name: 'Caminho B' }] },
  { id: 'setor-2', name: 'Setor 2', options: [{ id: 'rota-2a', name: 'Caminho A' }, { id: 'rota-2b', name: 'Caminho B' }, { id: 'rota-2c', name: 'Caminho C' }] },
  { id: 'setor-3', name: 'Setor 3', options: [{ id: 'rota-3a', name: 'Caminho A' }, { id: 'rota-3b', name: 'Caminho B' }] },
] as const;

export const multiplicationRoutesChallenge: MultiplicationChallengeDefinition = {
  id: 'multiplicacao-3',
  principle: 'multiplication',
  visual: 'routes',
  title: 'Caminhos da Fábrica',
  sectorLabel: 'Setor 02 — Fase 3',
  introduction: 'Um robô precisa atravessar três setores da fábrica. Em cada setor, escolha um caminho para descobrir todos os trajetos possíveis.',
  question: 'Quantos trajetos diferentes o robô pode realizar?',
  tutorial: ['Escolha um caminho em cada um dos três setores.', 'Multiplique as quantidades de caminhos para contar todos os trajetos.'],
  equation: '2 × 3 × 2 = ?',
  stages: routeStages,
  answers: [7, 10, 12, 14],
  correctAnswer: countCombinations(routeStages.map((stage) => stage.options.length)),
  hint: 'O robô escolhe um caminho em cada setor. Multiplique 2, 3 e 2.',
  feedback: {
    7: 'Não some os caminhos: o robô precisa passar pelos três setores.',
    10: 'Confira as possibilidades disponíveis em cada setor.',
    14: 'Revise a multiplicação das três etapas.',
  },
  successExplanation: 'Há 2 caminhos no primeiro setor, 3 no segundo e 2 no terceiro: 2 × 3 × 2 = 12 trajetos.',
};

export interface PigeonholeChallengeDefinition extends ChallengeDefinition {
  principle: 'pigeonhole';
  items: number;
  itemLabel: string;
  itemPlural: string;
  boxLabel: string;
  boxes: number;
  boxNames?: readonly string[];
  equation: string;
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
  itemLabel: 'peça',
  itemPlural: 'peças',
  boxLabel: 'caixa',
  boxes: 3,
  equation: '⌈7 ÷ 3⌉ = ?',
  answers: [2, 3, 7],
  correctAnswer: minimumGuaranteedOccupancy(7, 3),
  hint: 'Se cada caixa tivesse no máximo 2 peças, caberiam apenas 6. E a peça que sobrou?',
  feedback: {
    2: 'Três caixas com no máximo 2 peças guardariam apenas 6. Precisamos guardar 7.',
    7: 'Uma caixa pode receber todas as peças, mas isso não acontece em toda distribuição. Procure a menor quantidade inevitável.',
  },
  successExplanation: 'Alguma caixa terá pelo menos 3 peças! Com apenas 2 em cada caixa, guardaríamos 6. A sétima exige que uma caixa tenha 3 ou mais.',
};

export const pigeonholeDistributionChallenge: PigeonholeChallengeDefinition = {
  id: 'casas-de-pombo-2',
  principle: 'pigeonhole',
  title: 'O Armazém no Limite',
  sectorLabel: 'Setor 03 — Fase 2',
  introduction: 'Temos 13 caixas para distribuir em 5 compartimentos. Descubra o mínimo que necessariamente ficará em algum compartimento, mesmo com a divisão mais equilibrada.',
  question: 'Qual é a menor quantidade de caixas que podemos garantir em pelo menos um compartimento?',
  tutorial: ['Distribua as 13 caixas pelos cinco compartimentos.', 'Imagine a distribuição mais equilibrada e escolha a menor quantidade garantida.'],
  items: 13,
  itemLabel: 'caixa',
  itemPlural: 'caixas',
  boxLabel: 'compartimento',
  boxes: 5,
  equation: '⌈13 ÷ 5⌉ = ?',
  answers: [1, 2, 3, 5],
  correctAnswer: minimumGuaranteedOccupancy(13, 5),
  hint: 'Se cada compartimento tivesse no máximo 2 caixas, caberiam apenas 10.',
  feedback: {
    1: 'Pense no que ocorre quando as 13 caixas são distribuídas pelo maior número de compartimentos.',
    2: 'Cinco compartimentos com 2 caixas comportam apenas 10 caixas.',
    5: 'A quantidade garantida deve valer mesmo na distribuição mais equilibrada.',
  },
  successExplanation: 'Cinco compartimentos com 2 caixas acomodam 10. As três caixas restantes garantem que algum compartimento tenha pelo menos 3.',
};

export const pigeonholeComponentsChallenge: PigeonholeChallengeDefinition = {
  id: 'casas-de-pombo-3',
  principle: 'pigeonhole',
  title: 'O Controle de Qualidade',
  sectorLabel: 'Setor 03 — Fase 3',
  introduction: 'A inspeção encontrou 31 componentes defeituosos. Eles pertencem a seis categorias; descubra o mínimo garantido em alguma categoria.',
  question: 'Qual é a menor quantidade de componentes que podemos garantir que terá o mesmo tipo de defeito?',
  tutorial: ['Distribua os 31 componentes pelas seis categorias.', 'Considere a divisão mais equilibrada para encontrar o mínimo garantido.'],
  items: 31,
  itemLabel: 'componente',
  itemPlural: 'componentes',
  boxLabel: 'categoria',
  boxes: 6,
  boxNames: ['Elétrico', 'Mecânico', 'Acabamento', 'Conexão', 'Montagem', 'Isolamento'],
  equation: '⌈31 ÷ 6⌉ = ?',
  answers: [4, 5, 6, 7],
  correctAnswer: minimumGuaranteedOccupancy(31, 6),
  hint: 'Se cada categoria tivesse no máximo 5 componentes, quantos componentes seriam distribuídos?',
  feedback: {
    4: 'Considere quantos componentes cabem em seis categorias com até 5 em cada.',
    5: 'Seis categorias com 5 componentes comportam apenas 30 componentes.',
    7: 'A divisão mais equilibrada determina o menor mínimo garantido.',
  },
  successExplanation: 'Seis categorias com 5 componentes acomodam 30. O componente restante garante que uma categoria tenha pelo menos 6.',
};

export const demoChallenges = [
  additionRouteChallenge,
  multiplicationRobotChallenge,
  pigeonholeStorageChallenge,
] as const;

export const allChallenges = [
  additionRouteChallenge,
  additionSeparationChallenge,
  additionMaterialsChallenge,
  multiplicationRobotChallenge,
  multiplicationAssemblyChallenge,
  multiplicationRoutesChallenge,
  pigeonholeStorageChallenge,
  pigeonholeDistributionChallenge,
  pigeonholeComponentsChallenge,
] as const;

export type AnyChallengeDefinition = (typeof allChallenges)[number];

export function getChallengeById(id: ChallengeId): AnyChallengeDefinition | undefined {
  return allChallenges.find((challenge) => challenge.id === id);
}

export function getNextChallenge(id: ChallengeId): AnyChallengeDefinition | undefined {
  const index = allChallenges.findIndex((challenge) => challenge.id === id);
  return index < 0 ? undefined : allChallenges[index + 1];
}
