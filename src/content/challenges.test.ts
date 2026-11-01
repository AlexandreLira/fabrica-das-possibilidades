import { describe, expect, it } from 'vitest';
import { additionRouteChallenge } from './challenges';

describe('fase Pedido com rota alternativa', () => {
  it('soma as opções de rotas mutuamente exclusivas', () => {
    expect(additionRouteChallenge.groups.map((group) => group.count)).toEqual([3, 4]);
    expect(additionRouteChallenge.correctAnswer).toBe(7);
    expect(additionRouteChallenge.answers).toEqual([6, 7, 12]);
  });
});
