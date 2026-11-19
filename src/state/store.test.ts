import { expect, it } from 'vitest';
import type { ChallengeId } from '../content/sectors';
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
  expect(restored.completedChallengeIds).toEqual([]);
  expect(restored.allChallengesCompleted).toBe(false);
});

it('acompanha conclusões apenas durante a sessão e ignora repetições', () => {
  const storage = memoryStorage();
  const store = createAppStore(storage);
  store.getState().completeChallenge('adicao-1');
  store.getState().completeChallenge('adicao-1');
  store.getState().completeChallenge('multiplicacao-1');
  expect(store.getState()).toMatchObject({
    completedChallengeIds: ['adicao-1', 'multiplicacao-1'],
    allChallengesCompleted: false,
  });
  store.getState().completeChallenge('casas-de-pombo-1');
  expect(store.getState().allChallengesCompleted).toBe(false);
  ['adicao-2', 'adicao-3', 'multiplicacao-2', 'multiplicacao-3', 'casas-de-pombo-2', 'casas-de-pombo-3']
    .forEach((id) => store.getState().completeChallenge(id as ChallengeId));
  expect(store.getState().allChallengesCompleted).toBe(true);

  const persisted = JSON.parse(storage.getItem(STORAGE_KEY) ?? '{}');
  expect(persisted).toEqual({ version: 1, soundEnabled: true, instructionsCompleted: false });
  expect(createAppStore(storage).getState().completedChallengeIds).toEqual([]);
});

it('calcula conclusão usando o catálogo completo de fases, não um total fixo', () => {
  const ids = ['adicao-1', 'adicao-2', 'multiplicacao-1', 'multiplicacao-2'] as const;
  const store = createAppStore(undefined, ids);
  ids.slice(0, 3).forEach((id) => store.getState().completeChallenge(id));
  expect(store.getState().allChallengesCompleted).toBe(false);
  store.getState().completeChallenge(ids[3]);
  expect(store.getState().allChallengesCompleted).toBe(true);
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
