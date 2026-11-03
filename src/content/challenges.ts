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
