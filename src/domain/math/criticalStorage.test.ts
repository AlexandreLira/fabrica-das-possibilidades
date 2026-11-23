import { expect, it } from 'vitest';
import { criticalStorageBins, criticalStorageGuarantee, criticalStorageLimit, drawStoragePiece } from './criticalStorage';

it('counts the largest possible draw below the target and adds one', () => {
  expect(criticalStorageLimit).toEqual([6, 8, 9, 9, 9]);
  expect(criticalStorageGuarantee).toBe(42);
  expect(drawStoragePiece(criticalStorageLimit, 0)).toEqual([6, 8, 10, 9, 9]);
  expect(drawStoragePiece(criticalStorageLimit, 0.99)).toEqual([6, 8, 9, 9, 10]);
});

it('draws without replacement and stops when stock is depleted', () => {
  const stock = criticalStorageBins.map(({ stock }) => stock);
  let counts: readonly number[] = stock.map(() => 0);
  for (let draw = 0; draw < 50; draw += 1) counts = drawStoragePiece(counts, 0);
  expect(counts).toEqual(stock);
  expect(drawStoragePiece(counts, 0)).toBe(counts);
  expect(drawStoragePiece([0, 0, 0, 0, 0], 0.99)).toEqual([0, 0, 0, 0, 1]);
});
