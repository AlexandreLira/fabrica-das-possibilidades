import { countAlternatives, countCombinations } from './counting';

export const vaultLetters = ['A', 'B', 'C', 'D', 'E'] as const;
export const vaultDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
const evenDigits = vaultDigits.filter((digit) => Number(digit) % 2 === 0);

export function getVaultCodeError(code: string): string | null {
  if (!/^[A-E][0-9]{3}$/.test(code)) return 'Use uma letra de A a E seguida de três algarismos.';
  const digits = code.slice(1);
  if (digits.startsWith('0')) return 'O primeiro algarismo não pode ser 0.';
  if (new Set(digits).size !== 3) return 'Os três algarismos precisam ser diferentes.';
  if (Number(digits[2]) % 2 !== 0) return 'O último algarismo precisa ser par.';
  return null;
}

const middleChoices = vaultDigits.length - 2;
export const vaultEndingInZero = countCombinations([vaultDigits.length - 1, middleChoices]);
export const vaultEndingInOtherEven = countCombinations([evenDigits.length - 1, vaultDigits.length - 2, middleChoices]);
export const vaultDigitCombinations = countAlternatives([vaultEndingInZero, vaultEndingInOtherEven]);
export const vaultCodeCount = countCombinations([vaultLetters.length, vaultDigitCombinations]);
