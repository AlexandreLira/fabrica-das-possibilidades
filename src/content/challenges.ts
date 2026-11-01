import { countAlternatives } from '../domain/math/counting';
import type { ChallengeDefinition } from './sectors';

export type AdditionRouteId = 'local' | 'express';

export interface AdditionChallengeDefinition extends ChallengeDefinition {
  sectorLabel: string;
  introduction: string;
  groups: readonly {
    id: AdditionRouteId;
    name: string;
    count: number;
    optionsLabel: string;
  }[];
  answers: readonly number[];
  correctAnswer: number;
  hint: string;
  feedback: Readonly<Record<number, string>>;
  successExplanation: string;
}

const groups = [
  { id: 'local', name: 'Rota local', count: 3, optionsLabel: '3 veículos disponíveis' },
  { id: 'express', name: 'Rota expressa', count: 4, optionsLabel: '4 veículos disponíveis' },
] as const;

export const additionRouteChallenge: AdditionChallengeDefinition = {
  id: 'adicao-1',
  principle: 'addition',
  title: 'Pedido com rota alternativa',
  sectorLabel: 'Setor 01 — Fase 1/3',
  introduction: 'Um pedido precisa sair agora. Ele pode seguir pela rota local ou pela rota expressa. Examine as duas rotas e descubra quantas opções de envio existem.',
  groups,
  answers: [6, 7, 12],
  correctAnswer: countAlternatives(groups.map((group) => group.count)),
  hint: 'Quando escolhemos uma opção de um grupo ou de outro grupo, juntamos as quantidades.',
  feedback: {
    6: 'Conte novamente todas as opções das duas rotas.',
    12: 'As rotas são alternativas: usamos uma ou outra, então não multiplicamos.',
  },
  successExplanation: 'Muito bem! Como o pedido segue pela rota local ou pela expressa, somamos as alternativas: 3 + 4 = 7 possibilidades.',
};
