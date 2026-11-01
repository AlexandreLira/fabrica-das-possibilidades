import { useSyncExternalStore } from 'react';
export type Route = 'home' | 'instructions' | 'sectors' | 'addition-challenge';
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
function snapshot(): Route {
  if (window.location.hash === '#/instrucoes') return 'instructions';
  if (window.location.hash === '#/setores') return 'sectors';
  if (window.location.hash === '#/desafios/adicao-1') return 'addition-challenge';
  return 'home';
}
export function useRoute(): Route { return useSyncExternalStore(subscribe, snapshot, () => 'home'); }
