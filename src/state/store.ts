import { createStore } from 'zustand/vanilla';
import type { ChallengeId } from '../content/sectors';
import { demoChallenges } from '../content/challenges';
export const STORAGE_KEY = 'fabrica-possibilidades:v1';
interface Preferences { soundEnabled: boolean; instructionsCompleted: boolean }
export interface AppState extends Preferences {
  completedChallengeIds: ChallengeId[];
  allDemoChallengesCompleted: boolean;
  toggleSound: () => void;
  completeInstructions: () => void;
  completeChallenge: (id: ChallengeId) => void;
}
export interface StorageAdapter { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void }
function browserStorage(): StorageAdapter | undefined {
  try { return typeof window === 'undefined' ? undefined : window.localStorage; } catch { return undefined; }
}
function readPreferences(storage?: StorageAdapter): Preferences {
  const defaults = { soundEnabled: true, instructionsCompleted: false };
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const data: unknown = JSON.parse(raw);
    if (typeof data !== 'object' || data === null || !('version' in data) || data.version !== 1 ||
      !('soundEnabled' in data) || typeof data.soundEnabled !== 'boolean' ||
      !('instructionsCompleted' in data) || typeof data.instructionsCompleted !== 'boolean') return defaults;
    return { soundEnabled: data.soundEnabled, instructionsCompleted: data.instructionsCompleted };
  } catch { return defaults; }
}
export function createAppStore(
  storage: StorageAdapter | undefined = browserStorage(),
  challengeIds: readonly ChallengeId[] = demoChallenges.map((challenge) => challenge.id),
) {
  const store = createStore<AppState>((set) => ({
    ...readPreferences(storage), completedChallengeIds: [], allDemoChallengesCompleted: false,
    toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    completeInstructions: () => set({ instructionsCompleted: true }),
    completeChallenge: (id) => set((state) => {
      if (state.completedChallengeIds.includes(id)) return state;
      const completedChallengeIds = [...state.completedChallengeIds, id];
      return {
        completedChallengeIds,
        allDemoChallengesCompleted: challengeIds.length > 0 && challengeIds.every((challengeId) => completedChallengeIds.includes(challengeId)),
      };
    }),
  }));
  store.subscribe(({ soundEnabled, instructionsCompleted }) => {
    try { storage?.setItem(STORAGE_KEY, JSON.stringify({ version: 1, soundEnabled, instructionsCompleted })); }
    catch { /* The session continues in memory when storage is blocked or full. */ }
  });
  return store;
}
export const appStore = createAppStore();
