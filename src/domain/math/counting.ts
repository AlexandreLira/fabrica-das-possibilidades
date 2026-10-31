function cardinality(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError('Use inteiros seguros não negativos.');
}
function validateCounts(counts: readonly number[]): void {
  if (counts.length === 0) throw new RangeError('Informe ao menos um grupo ou etapa.');
  for (const count of counts) cardinality(count);
}
function safeResult(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new RangeError('Resultado fora da faixa segura.');
  return Number(value);
}
/** Soma cardinalidades de alternativas mutuamente exclusivas (sem sobreposição). */
export function countAlternatives(counts: readonly number[]): number {
  validateCounts(counts);
  return safeResult(counts.reduce((sum, count) => sum + BigInt(count), 0n));
}
/** Produto das opções em etapas independentes; uma etapa sem opções resulta em zero. */
export function countCombinations(counts: readonly number[]): number {
  validateCounts(counts);
  if (counts.includes(0)) return 0;
  return safeResult(counts.reduce((product, count) => product * BigInt(count), 1n));
}
/** Ao distribuir objetos entre caixas, alguma caixa tem pelo menos ceil(objetos/caixas). */
export function minimumGuaranteedOccupancy(items: number, boxes: number): number {
  cardinality(items); cardinality(boxes);
  if (boxes === 0) throw new RangeError('Informe ao menos uma caixa.');
  return Number((BigInt(items) + BigInt(boxes) - 1n) / BigInt(boxes));
}
