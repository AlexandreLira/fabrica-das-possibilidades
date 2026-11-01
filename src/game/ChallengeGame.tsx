import { useEffect, useRef, useState } from 'react';
import type { AdditionRouteId } from '../content/challenges';
import type { GameBridge } from './bridge/events';

interface ChallengeGameProps {
  bridge: GameBridge;
  revealedRoutes: readonly AdditionRouteId[];
  completed: boolean;
}

function StaticFactory({ revealedRoutes, completed }: Omit<ChallengeGameProps, 'bridge'>) {
  return <div className={`challenge-static ${completed ? 'is-complete' : ''}`} aria-hidden="true">
    <div className={`static-route ${revealedRoutes.includes('local') ? 'is-revealed' : ''}`}><span>LOCAL</span><b>▰ ▰ ▰</b></div>
    <div className={`static-route ${revealedRoutes.includes('express') ? 'is-revealed' : ''}`}><span>EXPRESSA</span><b>▰ ▰ ▰ ▰</b></div>
    <div className="static-conveyor"><i /><i /><i /><i /><span>▣</span></div>
  </div>;
}

export function ChallengeGame({ bridge, revealedRoutes, completed }: ChallengeGameProps) {
  const host = useRef<HTMLDivElement>(null);
  const syncedRoutes = useRef(new Set<AdditionRouteId>());
  const completionSynced = useRef(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    let cancelled = false;
    let failed = false;
    let destroy: (() => void) | undefined;
    const offReady = bridge.on('scene:ready', () => { clearTimeout(timeout); setStatus('ready'); });
    const fail = () => {
      if (cancelled) return;
      failed = true;
      clearTimeout(timeout);
      setStatus('failed');
      destroy?.();
      destroy = undefined;
    };
    const offFailed = bridge.on('scene:failed', fail);
    const timeout = window.setTimeout(fail, 12000);

    void import('./challengeEngine').then(({ mountChallengeGame }) => {
      if (cancelled || failed || !host.current) return;
      const mountedDestroy = mountChallengeGame(host.current, bridge);
      if (cancelled || failed) mountedDestroy(); else destroy = mountedDestroy;
    }).catch(fail);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      offReady();
      offFailed();
      bridge.clear();
      destroy?.();
    };
  }, [bridge]);

  useEffect(() => {
    if (status !== 'ready') return;
    for (const routeId of revealedRoutes) {
      if (syncedRoutes.current.has(routeId)) continue;
      syncedRoutes.current.add(routeId);
      bridge.emit('challenge:route-revealed', { routeId });
    }
    if (completed && !completionSynced.current) {
      completionSynced.current = true;
      bridge.emit('challenge:completed', undefined);
    }
  }, [bridge, completed, revealedRoutes, status]);

  return <div className="challenge-game">
    <div className="challenge-canvas-frame">
      <div ref={host} className="challenge-game-host" aria-hidden="true" />
      {status !== 'ready' && <StaticFactory revealedRoutes={revealedRoutes} completed={completed} />}
    </div>
    <p className="challenge-visual-status" aria-live="polite">
      {status === 'failed' ? 'A animação da fábrica está indisponível.' : status === 'loading' ? 'Preparando a fábrica…' : 'Fábrica conectada.'}
    </p>
  </div>;
}
