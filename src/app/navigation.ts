import { useSyncExternalStore } from 'react';
export type Route = 'home' | 'instructions' | 'sectors' | 'addition-challenge' | 'multiplication-challenge' | 'pigeonhole-challenge' | 'completion';
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
function snapshot(): Route {
  if (window.location.hash === '#/instrucoes') return 'instructions';
  if (window.location.hash === '#/setores') return 'sectors';
  if (window.location.hash === '#/desafios/adicao-1') return 'addition-challenge';
  if (window.location.hash === '#/desafios/multiplicacao-1') return 'multiplication-challenge';
  if (window.location.hash === '#/desafios/casas-de-pombo-1') return 'pigeonhole-challenge';
  if (window.location.hash === '#/conclusao') return 'completion';
  return 'home';
}
export function useRoute(): Route { return useSyncExternalStore(subscribe, snapshot, () => 'home'); }
