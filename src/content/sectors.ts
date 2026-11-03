export type Principle = 'addition' | 'multiplication' | 'pigeonhole';
export type ChallengeId = 'adicao-1' | 'multiplicacao-1' | 'casas-de-pombo-1';
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
export const sectors = [
  { id: 'addition', number: '01', symbol: '+', title: 'Princípio da Adição', name: 'Central de escolhas', description: 'Um caminho ou outro? Descubra como contar alternativas.' },
  { id: 'multiplication', number: '02', symbol: '×', title: 'Princípio da Multiplicação', name: 'Linha de montagem', description: 'Uma escolha depois da outra. Explore as combinações possíveis.' },
  { id: 'pigeonhole', number: '03', symbol: '▦', title: 'Princípio das Casas de Pombo', name: 'Depósito de possibilidades', description: 'Objetos e espaços: o que podemos garantir ao distribuí-los?' },
] as const satisfies readonly { id: Principle; number: string; symbol: string; title: string; name: string; description: string }[];
