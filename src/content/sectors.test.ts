import { describe, expect, it } from 'vitest';
import { isChallengeSlotId, sectors } from './sectors';

describe('slots de fases por setor', () => {
  it('oferece cinco IDs únicos por cada um dos três módulos', () => {
    expect(sectors).toHaveLength(3);
    expect(sectors.map((sector) => sector.challengeIds)).toEqual([
      ['adicao-1', 'adicao-2', 'adicao-3', 'adicao-4', 'adicao-5'],
      ['multiplicacao-1', 'multiplicacao-2', 'multiplicacao-3', 'multiplicacao-4', 'multiplicacao-5'],
      ['casas-de-pombo-1', 'casas-de-pombo-2', 'casas-de-pombo-3', 'casas-de-pombo-4', 'casas-de-pombo-5'],
    ]);
    expect(new Set(sectors.flatMap((sector) => sector.challengeIds)).size).toBe(15);
  });

  it('reconhece apenas IDs presentes nos slots dos módulos', () => {
    expect(isChallengeSlotId('adicao-2')).toBe(true);
    expect(isChallengeSlotId('casas-de-pombo-5')).toBe(true);
    expect(isChallengeSlotId('adicao-6')).toBe(false);
    expect(isChallengeSlotId('unknown-1')).toBe(false);
  });
});
