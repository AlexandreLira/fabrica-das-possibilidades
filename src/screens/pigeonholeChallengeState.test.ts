import { describe, expect, it } from 'vitest';
import {
  pigeonholeChallengeInitialState,
  reducePigeonholeChallenge,
  type BoxIndex,
} from './pigeonholeChallengeState';

function distribute(...boxes: readonly BoxIndex[]) {
  return boxes.reduce(
    (state, boxIndex) => reducePigeonholeChallenge(state, { type: 'place-item', boxIndex }),
    pigeonholeChallengeInitialState,
  );
}

describe('estado da fase das Casas de Pombo', () => {
  it('distribui exatamente sete peças e nunca deixa o restante negativo', () => {
    const full = distribute(0, 0, 0, 1, 1, 2, 2);
    expect(full).toMatchObject({ counts: [3, 2, 2], remaining: 0 });
    expect(reducePigeonholeChallenge(full, { type: 'place-item', boxIndex: 2 })).toEqual(full);
  });

  it('bloqueia respostas até distribuir todas as peças e reinicia a distribuição', () => {
    const partial = distribute(0, 1);
    expect(reducePigeonholeChallenge(partial, { type: 'select-answer', answer: 3 }).selectedAnswer).toBeNull();
    expect(reducePigeonholeChallenge(partial, { type: 'reset-distribution' })).toEqual(pigeonholeChallengeInitialState);
  });

  it.each([
    [[7, 0, 0] as const, 3],
    [[3, 2, 2] as const, 3],
  ])('usa o mesmo gabarito para a distribuição %j', (counts, answer) => {
    const ready = { ...pigeonholeChallengeInitialState, counts, remaining: 0, selectedAnswer: answer };
    expect(reducePigeonholeChallenge(ready, { type: 'confirm-answer' }).completed).toBe(true);
  });

  it('mantém a distribuição após um erro', () => {
    const ready = { ...pigeonholeChallengeInitialState, counts: [3, 2, 2] as const, remaining: 0, selectedAnswer: 2 };
    const result = reducePigeonholeChallenge(ready, { type: 'confirm-answer' });
    expect(result).toMatchObject({ counts: [3, 2, 2], remaining: 0, selectedAnswer: null, completed: false });
  });
});
