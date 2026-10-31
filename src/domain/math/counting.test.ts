import { describe, expect, it } from 'vitest';
import { countAlternatives, countCombinations, minimumGuaranteedOccupancy } from './counting';

describe('alternativas mutuamente exclusivas', () => {
  it('soma as escolhas de grupos distintos', () => expect(countAlternatives([3, 4])).toBe(7));
  it('aceita grupos vazios e o maior inteiro seguro', () => {
    expect(countAlternatives([0, 0])).toBe(0);
    expect(countAlternatives([Number.MAX_SAFE_INTEGER, 0])).toBe(Number.MAX_SAFE_INTEGER);
  });
  it('rejeita soma fora da faixa segura', () => expect(() => countAlternatives([Number.MAX_SAFE_INTEGER, 1])).toThrow(RangeError));
});
describe('etapas independentes', () => {
  it('multiplica escolhas por etapa', () => expect(countCombinations([3, 4])).toBe(12));
  it('uma etapa sem opções torna o resultado zero, mesmo após fatores grandes', () => {
    expect(countCombinations([4, 0, 3])).toBe(0);
    expect(countCombinations([Number.MAX_SAFE_INTEGER, 2, 0])).toBe(0);
  });
  it('rejeita produto fora da faixa segura', () => expect(() => countCombinations([Number.MAX_SAFE_INTEGER, 2])).toThrow(RangeError));
});
for (const count of [countAlternatives, countCombinations]) {
  it.each([[], [-1], [1.5], [NaN], [Infinity], [Number.MAX_SAFE_INTEGER + 1]].map(input => ({ input })))('rejeita cardinalidade inválida $input', ({ input }) => {
    expect(() => count(input)).toThrow(RangeError);
  });
}
describe('casas de pombo', () => {
  it.each([[10, 3, 4], [9, 3, 3], [0, 3, 0], [2, 5, 1], [7, 1, 7]])('%i objetos em %i caixas garantem %i', (items, boxes, expected) => {
    expect(minimumGuaranteedOccupancy(items, boxes)).toBe(expected);
  });
  it.each([[1, 0], [-1, 3], [2, -1], [2.5, 3], [2, 1.5], [NaN, 2], [2, Infinity]])('rejeita parâmetros inválidos %j', (items, boxes) => {
    expect(() => minimumGuaranteedOccupancy(items, boxes)).toThrow(RangeError);
  });
});

it('rejeita listas esparsas sem cardinalidade em cada posição', () => {
  expect(() => countAlternatives(Array<number>(1))).toThrow(RangeError);
  expect(() => countCombinations([1, ...Array<number>(1)])).toThrow(RangeError);
});
