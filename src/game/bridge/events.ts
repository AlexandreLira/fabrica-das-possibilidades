export interface GameEvents {
  'scene:ready': undefined;
  'scene:failed': undefined;
  'bot:greet': { reducedMotion: boolean };
  'bot:greeted': { message: string };
}
export function createGameBridge() {
  const listeners: { [K in keyof GameEvents]: Set<(payload: GameEvents[K]) => void> } = {
    'scene:ready': new Set(), 'scene:failed': new Set(), 'bot:greet': new Set(), 'bot:greeted': new Set(),
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
