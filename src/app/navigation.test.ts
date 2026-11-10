import { describe, expect, it } from 'vitest';
import { parseRoute } from './navigation';

describe('rotas de fases', () => {
  it.each([
    ['#/instrucoes', 'instructions'],
    ['#/setores', 'sectors'],
    ['#/conclusao', 'completion'],
    ['#/desafios/adicao-1', 'challenge:adicao-1'],
    ['#/desafios/multiplicacao-2', 'challenge:multiplicacao-2'],
    ['#/desafios/casas-de-pombo-5', 'challenge:casas-de-pombo-5'],
  ])('resolve %s para sua rota registrada', (hash, expected) => {
    expect(parseRoute(hash)).toBe(expected);
  });

  it('ignora hashes de fases fora dos slots conhecidos', () => {
    expect(parseRoute('#/desafios/adicao-6')).toBe('home');
    expect(parseRoute('#/desafios/unknown-1')).toBe('home');
  });
});
