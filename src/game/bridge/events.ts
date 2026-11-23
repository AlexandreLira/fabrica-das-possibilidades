export type BotAction = 'wave' | 'talk' | 'dance';

export interface GameEvents {
  'scene:ready': undefined;
  'scene:failed': undefined;
  'bot:act': { action: BotAction; reducedMotion: boolean };
  'challenge:group-revealed': { groupId: string };
  'challenge:stage-selected': { stageId: string; optionId: string };
  'challenge:item-placed': { boxIndex: number; counts: readonly number[]; remaining: number };
  'challenge:distribution-reset': { items: number };
  'challenge:answer-evaluated': { answer: number; correct: boolean };
  'challenge:completed': undefined;
}
export function createGameBridge() {
  const listeners: { [K in keyof GameEvents]: Set<(payload: GameEvents[K]) => void> } = {
    'scene:ready': new Set(), 'scene:failed': new Set(), 'bot:act': new Set(),
    'challenge:group-revealed': new Set(), 'challenge:stage-selected': new Set(), 'challenge:item-placed': new Set(),
    'challenge:distribution-reset': new Set(), 'challenge:answer-evaluated': new Set(), 'challenge:completed': new Set(),
  };
  return {
    on<K extends keyof GameEvents>(event: K, listener: (payload: GameEvents[K]) => void) {
      listeners[event].add(listener);
      return () => { listeners[event].delete(listener); };
    },
    emit<K extends keyof GameEvents>(event: K, payload: GameEvents[K]) {
      listeners[event].forEach((listener) => listener(payload));
    },
    clear() { Object.values(listeners).forEach((set) => set.clear()); },
  };
}
export type GameBridge = ReturnType<typeof createGameBridge>;
