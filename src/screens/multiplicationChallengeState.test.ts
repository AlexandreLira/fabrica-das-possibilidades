import { describe, expect, it } from 'vitest';
import {
  multiplicationChallengeInitialState,
  reduceMultiplicationChallenge,
} from './multiplicationChallengeState';

describe('estado da fase de multiplicação', () => {
  it('só libera respostas depois de escolher uma carcaça e uma antena', () => {
    const withBody = reduceMultiplicationChallenge(multiplicationChallengeInitialState, { type: 'select-body', bodyId: 'ciano' });
    expect(reduceMultiplicationChallenge(withBody, { type: 'select-answer', answer: 6 }).selectedAnswer).toBeNull();

    const ready = reduceMultiplicationChallenge(withBody, { type: 'select-antenna', antennaId: 'haste' });
    expect(reduceMultiplicationChallenge(ready, { type: 'select-answer', answer: 6 }).selectedAnswer).toBe(6);
  });

  it('mantém a montagem depois de um erro e permite outra tentativa', () => {
    const ready = {
      ...multiplicationChallengeInitialState,
      bodyId: 'ciano' as const,
      antennaId: 'haste' as const,
      selectedAnswer: 5,
    };
    const result = reduceMultiplicationChallenge(ready, { type: 'confirm-answer' });
    expect(result).toMatchObject({ bodyId: 'ciano', antennaId: 'haste', selectedAnswer: null, completed: false });
    expect(result.feedback).toContain('Somar');
  });

  it('conclui com seis e reinicia a interação', () => {
    const ready = {
      ...multiplicationChallengeInitialState,
      bodyId: 'amarela' as const,
      antennaId: 'dupla' as const,
      selectedAnswer: 6,
    };
    const completed = reduceMultiplicationChallenge(ready, { type: 'confirm-answer' });
    expect(completed.completed).toBe(true);
    expect(reduceMultiplicationChallenge(completed, { type: 'reset' })).toEqual(multiplicationChallengeInitialState);
  });
});
