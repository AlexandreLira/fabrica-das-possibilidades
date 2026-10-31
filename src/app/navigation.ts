import { useSyncExternalStore } from 'react';
export type Route = 'home' | 'instructions' | 'sectors';
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
function snapshot(): Route {
  if (window.location.hash === '#/instrucoes') return 'instructions';
  if (window.location.hash === '#/setores') return 'sectors';
  return 'home';
}
export function useRoute(): Route { return useSyncExternalStore(subscribe, snapshot, () => 'home'); }
