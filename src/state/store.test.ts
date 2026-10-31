import { expect, it } from 'vitest';
import { createAppStore, STORAGE_KEY } from './store';
function memoryStorage() {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } };
}
it('restaura preferências e tutorial sem inventar progresso', () => {
  const storage = memoryStorage();
  const first = createAppStore(storage);
  first.getState().toggleSound();
  first.getState().completeInstructions();
  const restored = createAppStore(storage).getState();
  expect(restored.soundEnabled).toBe(false);
  expect(restored.instructionsCompleted).toBe(true);
  expect(restored.progress).toEqual({});
});
it.each(['{bad', 'null', JSON.stringify({ version: 1, soundEnabled: 'yes', instructionsCompleted: true }), JSON.stringify({ version: 999, soundEnabled: false })])('recupera armazenamento inválido %s', (data) => {
  const storage = memoryStorage(); storage.setItem(STORAGE_KEY, data);
  expect(createAppStore(storage).getState().soundEnabled).toBe(true);
  expect(createAppStore(storage).getState().instructionsCompleted).toBe(false);
});
it('continua em memória se ler ou gravar falhar', () => {
  const store = createAppStore({ getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('quota'); } });
  store.getState().toggleSound(); store.getState().completeInstructions();
  expect(store.getState().soundEnabled).toBe(false);
  expect(store.getState().instructionsCompleted).toBe(true);
});
