import { countAlternatives } from './counting';

export const criticalStorageTarget = 10;
export const criticalStorageBins = [
  { name: 'Azul', stock: 6, color: '#73abfa' },
  { name: 'Verde', stock: 8, color: '#79df9e' },
  { name: 'Vermelha', stock: 12, color: '#ef8279' },
  { name: 'Amarela', stock: 12, color: '#f4c955' },
  { name: 'Branca', stock: 12, color: '#f7f2e5' },
] as const;

export const criticalStorageLimit = criticalStorageBins.map(({ stock }) => Math.min(stock, criticalStorageTarget - 1));
export const criticalStorageGuarantee = countAlternatives([...criticalStorageLimit, 1]);

export function drawStoragePiece(counts: readonly number[], random: number): readonly number[] {
  const remaining = criticalStorageBins.map(({ stock }, index) => stock - (counts[index] ?? 0));
  const total = countAlternatives(remaining);
  let ticket = Math.floor(random * total);
  const index = remaining.findIndex((stock) => {
    ticket -= stock;
    return ticket < 0;
  });
  if (index < 0) return counts;
  return remaining.map((_, binIndex) => (counts[binIndex] ?? 0) + Number(index === binIndex));
}
