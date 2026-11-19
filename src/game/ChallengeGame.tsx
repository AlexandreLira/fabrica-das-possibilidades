import { useEffect, useRef, useState } from 'react';
import type {
  AdditionChallengeDefinition,
  MultiplicationChallengeDefinition,
  PigeonholeChallengeDefinition,
} from '../content/challenges';
import type { BoxCounts } from '../screens/pigeonholeChallengeState';
import type { GameBridge } from './bridge/events';

interface BaseChallengeGameProps {
  bridge: GameBridge;
  completed: boolean;
}

export type ChallengeGameProps = BaseChallengeGameProps & (
  | { kind: 'addition'; challenge: AdditionChallengeDefinition; revealedGroups: readonly string[] }
  | { kind: 'multiplication'; challenge: MultiplicationChallengeDefinition; selections: Readonly<Record<string, string>> }
  | { kind: 'pigeonhole'; challenge: PigeonholeChallengeDefinition; counts: BoxCounts; remaining: number; lastBoxIndex: number | null }
);

function AdditionStatic({ challenge, revealedGroups, completed }: {
  challenge: AdditionChallengeDefinition;
  revealedGroups: readonly string[];
  completed: boolean;
}) {
  return <div className={`challenge-static addition-static ${challenge.groups.length > 2 ? 'many-groups' : ''} ${completed ? 'is-complete' : ''}`} aria-hidden="true">
    {challenge.groups.map((group, index) => <div className={`static-route ${revealedGroups.includes(group.id) ? 'is-revealed' : ''}`} key={group.id}>
      <span>{group.name}</span><b>{'▰ '.repeat(group.count).trim()}</b>
      <strong>{index + 1}</strong>
    </div>)}
    <div className="static-conveyor"><i /><i /><i /><i /><span>▣</span></div>
  </div>;
}

function MultiplicationStatic({ challenge, selections, completed }: {
  challenge: MultiplicationChallengeDefinition;
  selections: Readonly<Record<string, string>>;
  completed: boolean;
}) {
  const selectedOptions = challenge.stages.map((stage) => stage.options.find((option) => option.id === selections[stage.id]));
  if (challenge.visual === 'routes') {
    return <div className={`challenge-static multiplication-static route-static ${completed ? 'is-complete' : ''}`} aria-hidden="true">
      {challenge.stages.map((stage, index) => <div className="static-route-stage" key={stage.id}>
        <span>{stage.name}</span><b>{selections[stage.id] ? '◆' : '◇'}</b><small>{stage.options.length} caminhos</small><i>{index < challenge.stages.length - 1 ? '→' : '★'}</i>
      </div>)}
    </div>;
  }
  const body = selectedOptions[0];
  const antenna = selectedOptions[1];
  return <div className={`challenge-static multiplication-static ${completed ? 'is-complete' : ''}`} aria-hidden="true">
    <span className="static-antenna">{antenna?.symbol ?? '?'}</span>
    <span className="static-robot" style={{ background: body?.color ?? '#38505d' }}>□</span>
    <div className="static-conveyor"><i /><i /><i /><i /><span>◆</span></div>
  </div>;
}

function PigeonholeStatic({ challenge, counts, completed }: {
  challenge: PigeonholeChallengeDefinition;
  counts: BoxCounts;
  completed: boolean;
}) {
  return <div className={`challenge-static pigeonhole-static ${counts.length > 3 ? 'many-boxes' : ''} ${completed ? 'is-complete' : ''}`} aria-hidden="true">
    {counts.map((count, index) => <div className="static-box" key={index}>
      <span>{challenge.boxNames?.[index] ?? `${challenge.boxLabel} ${index + 1}`}</span>
      <b>{'■ '.repeat(Math.min(count, 8)).trim() || '—'}</b><strong>{count}</strong>
    </div>)}
  </div>;
}

function StaticFactory(props: ChallengeGameProps) {
  if (props.kind === 'addition') return <AdditionStatic challenge={props.challenge} revealedGroups={props.revealedGroups} completed={props.completed} />;
  if (props.kind === 'multiplication') return <MultiplicationStatic challenge={props.challenge} selections={props.selections} completed={props.completed} />;
  return <PigeonholeStatic challenge={props.challenge} counts={props.counts} completed={props.completed} />;
}

export function ChallengeGame(props: ChallengeGameProps) {
  const { bridge, completed, kind } = props;
  const challenge = props.challenge;
  const revealedGroups = props.kind === 'addition' ? props.revealedGroups : null;
  const selections = props.kind === 'multiplication' ? props.selections : null;
  const pigeonholeChallenge = props.kind === 'pigeonhole' ? props.challenge : null;
  const counts = props.kind === 'pigeonhole' ? props.counts : null;
  const remaining = props.kind === 'pigeonhole' ? props.remaining : null;
  const lastBoxIndex = props.kind === 'pigeonhole' ? props.lastBoxIndex : null;
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
      const mountedDestroy = mountChallengeGame(host.current, bridge, challenge);
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
  }, [bridge, challenge, kind]);

  useEffect(() => {
    if (status !== 'ready') return;
    if (kind === 'addition') {
      revealedGroups?.forEach((groupId) => bridge.emit('challenge:group-revealed', { groupId }));
    } else if (kind === 'multiplication') {
      Object.entries(selections ?? {}).forEach(([stageId, optionId]) => bridge.emit('challenge:stage-selected', { stageId, optionId }));
    } else if (pigeonholeChallenge && counts && remaining !== null) {
      if (remaining > previousRemaining.current) bridge.emit('challenge:distribution-reset', { items: pigeonholeChallenge.items });
      bridge.emit('challenge:item-placed', {
        boxIndex: lastBoxIndex ?? 0,
        counts,
        remaining,
      });
      previousRemaining.current = remaining;
    }
    if (completed && !completionSynced.current) {
      completionSynced.current = true;
      bridge.emit('challenge:completed', undefined);
    } else if (!completed) {
      completionSynced.current = false;
    }
  }, [bridge, completed, counts, kind, lastBoxIndex, pigeonholeChallenge, remaining, revealedGroups, selections, status]);

  return <div className="challenge-game">
    <div className="challenge-canvas-frame">
      <div ref={host} className="challenge-game-host" aria-hidden="true" />
      {status !== 'ready' && <StaticFactory {...props} />}
    </div>
    <p className="challenge-visual-status" aria-live="polite">
      {status === 'failed' ? 'A animação da fábrica está indisponível.' : status === 'loading' ? 'Preparando a fábrica…' : 'Fábrica conectada.'}
    </p>
  </div>;
}
