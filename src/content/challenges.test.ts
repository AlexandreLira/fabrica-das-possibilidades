import { describe, expect, it } from 'vitest';
import {
  additionRouteChallenge,
  multiplicationRobotChallenge,
  pigeonholeStorageChallenge,
} from './challenges';

describe('fase Pedido com rota alternativa', () => {
  it('soma as opções de rotas mutuamente exclusivas', () => {
    expect(additionRouteChallenge.groups.map((group) => group.count)).toEqual([3, 4]);
    expect(additionRouteChallenge.correctAnswer).toBe(7);
    expect(additionRouteChallenge.answers).toEqual([6, 7, 12]);
  });
});

describe('fase Monte o robô', () => {
  it('multiplica carcaças e antenas independentes', () => {
    expect(multiplicationRobotChallenge.bodyOptions).toHaveLength(3);
    expect(multiplicationRobotChallenge.antennaOptions).toHaveLength(2);
    expect(multiplicationRobotChallenge.correctAnswer).toBe(6);
    expect(multiplicationRobotChallenge.answers).toEqual([5, 6, 9]);
  });
});

describe('fase Organize o depósito', () => {
  it('garante a ocupação mínima sem depender de uma distribuição escolhida', () => {
    expect(pigeonholeStorageChallenge).toMatchObject({ items: 7, boxes: 3, correctAnswer: 3 });
    expect(pigeonholeStorageChallenge.answers).toEqual([2, 3, 7]);
  });
});
