import { useEffect, useRef, useState } from 'react';
import type { AdditionRouteId, RobotAntennaId, RobotBodyId } from '../content/challenges';
import type { BoxCounts, BoxIndex } from '../screens/pigeonholeChallengeState';
import type { GameBridge } from './bridge/events';

interface BaseChallengeGameProps {
  bridge: GameBridge;
  completed: boolean;
}

export type ChallengeGameProps = BaseChallengeGameProps & (
  | { kind: 'addition'; revealedRoutes: readonly AdditionRouteId[] }
  | { kind: 'multiplication'; bodyId: RobotBodyId | null; antennaId: RobotAntennaId | null }
  | { kind: 'pigeonhole'; counts: BoxCounts; remaining: number; lastBoxIndex: BoxIndex | null }
);

type StaticChallengeProps =
  | { kind: 'addition'; revealedRoutes: readonly AdditionRouteId[]; completed: boolean }
  | { kind: 'multiplication'; bodyId: RobotBodyId | null; antennaId: RobotAntennaId | null; completed: boolean }
  | { kind: 'pigeonhole'; counts: BoxCounts; remaining: number; lastBoxIndex: BoxIndex | null; completed: boolean };

function AdditionStatic({ revealedRoutes, completed }: { revealedRoutes: readonly AdditionRouteId[]; completed: boolean }) {
  return <div className={`challenge-static addition-static ${completed ? 'is-complete' : ''}`} aria-hidden="true">
    <div className={`static-route ${revealedRoutes.includes('local') ? 'is-revealed' : ''}`}><span>LOCAL</span><b>▰ ▰ ▰</b></div>
    <div className={`static-route ${revealedRoutes.includes('express') ? 'is-revealed' : ''}`}><span>EXPRESSA</span><b>▰ ▰ ▰ ▰</b></div>
    <div className="static-conveyor"><i /><i /><i /><i /><span>▣</span></div>
  </div>;
}

function MultiplicationStatic({ bodyId, antennaId, completed }: { bodyId: RobotBodyId | null; antennaId: RobotAntennaId | null; completed: boolean }) {
  const colors: Record<RobotBodyId, string> = { ciano: '#71dfda', amarela: '#f4c955', coral: '#ef7d72' };
  return <div className={`challenge-static multiplication-static ${completed ? 'is-complete' : ''}`} aria-hidden="true">
    <span className="static-antenna">{antennaId === 'dupla' ? 'Y' : antennaId === 'haste' ? '│' : '?'}</span>
    <span className="static-robot" style={{ background: bodyId ? colors[bodyId] : '#38505d' }}>□</span>
    <div className="static-conveyor"><i /><i /><i /><i /><span>◆</span></div>
  </div>;
}

function PigeonholeStatic({ counts, completed }: { counts: BoxCounts; completed: boolean }) {
  return <div className={`challenge-static pigeonhole-static ${completed ? 'is-complete' : ''}`} aria-hidden="true">
    {counts.map((count, index) => <div className="static-box" key={index}><span>CAIXA {index + 1}</span><b>{'■ '.repeat(count).trim() || '—'}</b><strong>{count}</strong></div>)}
  </div>;
}

function StaticFactory(props: StaticChallengeProps) {
  if (props.kind === 'addition') return <AdditionStatic revealedRoutes={props.revealedRoutes} completed={props.completed} />;
  if (props.kind === 'multiplication') return <MultiplicationStatic bodyId={props.bodyId} antennaId={props.antennaId} completed={props.completed} />;
  return <PigeonholeStatic counts={props.counts} completed={props.completed} />;
}

export function ChallengeGame(props: ChallengeGameProps) {
  const { bridge, completed, kind } = props;
  const host = useRef<HTMLDivElement>(null);
  const completionSynced = useRef(false);
  const previousRemaining = useRef(kind === 'pigeonhole' ? props.remaining : 0);
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
      const mountedDestroy = mountChallengeGame(host.current, bridge, kind);
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
  }, [bridge, kind]);

  useEffect(() => {
    if (status !== 'ready') return;
    if (props.kind === 'addition') {
      props.revealedRoutes.forEach((routeId) => bridge.emit('challenge:route-revealed', { routeId }));
    } else if (props.kind === 'multiplication') {
      if (props.bodyId && props.antennaId) bridge.emit('challenge:robot-configured', { bodyId: props.bodyId, antennaId: props.antennaId });
    } else {
      if (props.remaining > previousRemaining.current) bridge.emit('challenge:distribution-reset', undefined);
      bridge.emit('challenge:item-placed', {
        boxIndex: props.lastBoxIndex ?? 0,
        counts: props.counts,
        remaining: props.remaining,
      });
      previousRemaining.current = props.remaining;
    }
    if (completed && !completionSynced.current) {
      completionSynced.current = true;
      bridge.emit('challenge:completed', undefined);
    } else if (!completed) {
      completionSynced.current = false;
    }
  }, [bridge, completed, props, status]);

  const staticProps = { ...props } as StaticChallengeProps;
  return <div className="challenge-game">
    <div className="challenge-canvas-frame">
      <div ref={host} className="challenge-game-host" aria-hidden="true" />
      {status !== 'ready' && <StaticFactory {...staticProps} />}
    </div>
    <p className="challenge-visual-status" aria-live="polite">
      {status === 'failed' ? 'A animação da fábrica está indisponível.' : status === 'loading' ? 'Preparando a fábrica…' : 'Fábrica conectada.'}
    </p>
  </div>;
}
