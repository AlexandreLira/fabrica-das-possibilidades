import { useSyncExternalStore } from 'react';
import { isChallengeSlotId, type ChallengeId } from '../content/sectors';
export type Route = 'home' | 'instructions' | 'sectors' | 'completion' | `challenge:${ChallengeId}`;
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
export function parseRoute(hash: string): Route {
  if (hash === '#/instrucoes') return 'instructions';
  if (hash === '#/setores') return 'sectors';
  if (hash === '#/conclusao') return 'completion';
  const match = /^#\/desafios\/([a-z-]+-\d+)$/.exec(hash);
  if (match?.[1] && isChallengeSlotId(match[1])) return `challenge:${match[1]}`;
  return 'home';
}
function snapshot(): Route { return parseRoute(window.location.hash); }
export function useRoute(): Route { return useSyncExternalStore(subscribe, snapshot, () => 'home'); }
