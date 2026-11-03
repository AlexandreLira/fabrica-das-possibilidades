import { describe, expect, it } from 'vitest';
import {
  additionChallengeInitialState,
  reduceAdditionChallenge,
} from './additionChallengeState';

describe('estado da fase de adição', () => {
  it('só permite selecionar uma resposta após examinar as duas rotas', () => {
    const withLocal = reduceAdditionChallenge(additionChallengeInitialState, { type: 'reveal-route', routeId: 'local' });
    const ignored = reduceAdditionChallenge(withLocal, { type: 'select-answer', answer: 7 });
    expect(ignored.selectedAnswer).toBeNull();

    const ready = reduceAdditionChallenge(withLocal, { type: 'reveal-route', routeId: 'express' });
    const selected = reduceAdditionChallenge(ready, { type: 'select-answer', answer: 7 });
    expect(selected.selectedAnswer).toBe(7);
  });

  it('mostra a dica sem concluir nem revelar o resultado', () => {
    const state = reduceAdditionChallenge(additionChallengeInitialState, { type: 'show-hint' });
    expect(state.hintVisible).toBe(true);
    expect(state.completed).toBe(false);
    expect(state.selectedAnswer).toBeNull();
  });

  it.each([
    [12, 'Multiplicar contaria pares de veículos. Aqui escolhemos apenas um veículo, de uma rota ou da outra.'],
    [6, 'Confira os dois grupos: são 3 veículos em uma rota e 4 na outra.'],
  ] as const)('mantém a fase ativa após a resposta errada %i', (answer, feedback) => {
    const ready = { ...additionChallengeInitialState, revealedRoutes: ['local', 'express'] as const, selectedAnswer: answer };
    const state = reduceAdditionChallenge(ready, { type: 'confirm-answer' });
    expect(state).toMatchObject({ completed: false, selectedAnswer: null, feedback });
  });

  it('encerra e bloqueia a fase ao confirmar 7', () => {
    const ready = { ...additionChallengeInitialState, revealedRoutes: ['local', 'express'] as const, selectedAnswer: 7 };
    const completed = reduceAdditionChallenge(ready, { type: 'confirm-answer' });
    const ignored = reduceAdditionChallenge(completed, { type: 'select-answer', answer: 12 });
    expect(completed).toMatchObject({ completed: true, selectedAnswer: 7 });
    expect(ignored).toEqual(completed);
  });

  it('reinicia a interação depois da conclusão', () => {
    const completed = { ...additionChallengeInitialState, completed: true, selectedAnswer: 7, feedback: 'concluída' };
    expect(reduceAdditionChallenge(completed, { type: 'reset' })).toEqual(additionChallengeInitialState);
  });
});
