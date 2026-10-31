import { createStore } from 'zustand/vanilla';
export const STORAGE_KEY = 'fabrica-possibilidades:v1';
export interface ChallengeProgress { completed: boolean; score: number; hintsUsed: number }
interface Preferences { soundEnabled: boolean; instructionsCompleted: boolean }
export interface AppState extends Preferences {
  progress: Record<string, ChallengeProgress>;
  toggleSound: () => void;
  completeInstructions: () => void;
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
export function createAppStore(storage: StorageAdapter | undefined = browserStorage()) {
  const store = createStore<AppState>((set) => ({
    ...readPreferences(storage), progress: {},
    toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    completeInstructions: () => set({ instructionsCompleted: true }),
  }));
  store.subscribe(({ soundEnabled, instructionsCompleted }) => {
    try { storage?.setItem(STORAGE_KEY, JSON.stringify({ version: 1, soundEnabled, instructionsCompleted })); }
    catch { /* The session continues in memory when storage is blocked or full. */ }
  });
  return store;
}
export const appStore = createAppStore();
