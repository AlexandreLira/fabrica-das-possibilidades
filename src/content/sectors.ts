export type Principle = 'addition' | 'multiplication' | 'pigeonhole';
export type ChallengeSlug = 'adicao' | 'multiplicacao' | 'casas-de-pombo';
export type ChallengeId = `${ChallengeSlug}-${number}`;
export interface ChallengeDefinition {
  id: ChallengeId;
  principle: Principle;
  title: string;
  sectorLabel: string;
  introduction: string;
  question: string;
  answers: readonly number[];
  correctAnswer: number;
  hint: string;
  feedback: Readonly<Record<number, string>>;
  successExplanation: string;
  tutorial: readonly string[];
}

const challengeIdsFor = (slug: ChallengeSlug): readonly ChallengeId[] =>
  [1, 2, 3, 4, 5].map((number) => `${slug}-${number}` as ChallengeId);

export const sectors = [
  { id: 'addition', slug: 'adicao', challengeIds: challengeIdsFor('adicao'), number: '01', symbol: '+', title: 'Princípio da Adição', name: 'Central de escolhas', description: 'Um caminho ou outro? Descubra como contar alternativas.' },
  { id: 'multiplication', slug: 'multiplicacao', challengeIds: challengeIdsFor('multiplicacao'), number: '02', symbol: '×', title: 'Princípio da Multiplicação', name: 'Linha de montagem', description: 'Uma escolha depois da outra. Explore as combinações possíveis.' },
  { id: 'pigeonhole', slug: 'casas-de-pombo', challengeIds: challengeIdsFor('casas-de-pombo'), number: '03', symbol: '▦', title: 'Princípio das Casas de Pombo', name: 'Depósito de possibilidades', description: 'Objetos e espaços: o que podemos garantir ao distribuí-los?' },
] as const satisfies readonly { id: Principle; slug: ChallengeSlug; challengeIds: readonly ChallengeId[]; number: string; symbol: string; title: string; name: string; description: string }[];

const challengeSlotIds = new Set<string>(sectors.flatMap((sector) => sector.challengeIds));

export function isChallengeSlotId(id: string): id is ChallengeId {
  return challengeSlotIds.has(id);
}

export function getSectorForChallenge(id: ChallengeId) {
  return sectors.find((sector) => sector.challengeIds.includes(id));
}
