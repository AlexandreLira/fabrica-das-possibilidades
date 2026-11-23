import { expect, it } from 'vitest';
import { getVaultCodeError, vaultCodeCount, vaultDigits, vaultEndingInOtherEven, vaultEndingInZero, vaultLetters } from './vaultCode';

it.each([
  ['Z120', 'Use uma letra'],
  ['A012', 'não pode ser 0'],
  ['A112', 'precisam ser diferentes'],
  ['A123', 'precisa ser par'],
])('explains why %s is invalid', (code, message) => {
  expect(getVaultCodeError(code)).toContain(message);
});

it('matches the analytical count against all codes in the game', () => {
  const trios = vaultDigits.flatMap((first) =>
    vaultDigits.flatMap((middle) => vaultDigits.map((last) => first + middle + last)));
  const valid = vaultLetters.flatMap((letter) => trios.map((trio) => letter + trio))
    .filter((code) => getVaultCodeError(code) === null);
  expect(vaultEndingInZero).toBe(72);
  expect(vaultEndingInOtherEven).toBe(256);
  expect(valid.filter((code) => code.endsWith('0'))).toHaveLength(5 * vaultEndingInZero);
  expect(valid).toHaveLength(vaultCodeCount);
  expect(vaultCodeCount).toBe(1640);
});
