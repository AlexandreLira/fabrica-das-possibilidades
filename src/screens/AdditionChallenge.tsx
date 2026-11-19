import { useReducer, useState } from 'react';
import { useStore } from 'zustand';
import type { AdditionChallengeDefinition } from '../content/challenges';
import { getNextChallenge } from '../content/challenges';
import { ChallengeGame } from '../game/ChallengeGame';
import { createGameBridge } from '../game/bridge/events';
import { playFeedback } from '../audio/effects';
import { appStore } from '../state/store';
import { AnswerPanel, ChallengeIntro, CompletionActions } from './ChallengeComponents';
import { createAdditionChallengeState, reduceAdditionChallenge } from './additionChallengeState';

export function AdditionChallenge({ challenge }: { challenge: AdditionChallengeDefinition }) {
  const [state, dispatch] = useReducer(
    (current: ReturnType<typeof createAdditionChallengeState>, action: Parameters<typeof reduceAdditionChallenge>[1]) => reduceAdditionChallenge(current, action, challenge),
    createAdditionChallengeState(),
  );
  const [bridge] = useState(createGameBridge);
  const [gameRun, setGameRun] = useState(0);
  const completeChallenge = useStore(appStore, (store) => store.completeChallenge);
  const groupsReady = state.revealedGroups.length === challenge.groups.length;
  const nextChallenge = getNextChallenge(challenge.id);

  const revealGroup = (groupId: string) => {
    dispatch({ type: 'reveal-group', groupId });
    bridge.emit('challenge:group-revealed', { groupId });
    playFeedback('reveal');
  };

  const confirmAnswer = () => {
    if (state.selectedAnswer === null) return;
    const correct = state.selectedAnswer === challenge.correctAnswer;
    dispatch({ type: 'confirm-answer' });
    bridge.emit('challenge:answer-evaluated', { answer: state.selectedAnswer, correct });
    if (correct) completeChallenge(challenge.id);
    playFeedback(correct ? (appStore.getState().allChallengesCompleted ? 'complete' : 'success') : 'error');
  };

  return <>
    <ChallengeIntro challenge={challenge} />

    <ChallengeGame key={gameRun} kind="addition" bridge={bridge} challenge={challenge} revealedGroups={state.revealedGroups} completed={state.completed} />

    <section className="challenge-routes" aria-labelledby={`${challenge.id}-groups-heading`}>
      <h2 id={`${challenge.id}-groups-heading`}>Examine os grupos</h2>
      <div className={`route-grid ${challenge.groups.length > 2 ? 'three-groups' : ''}`}>
        {challenge.groups.map((group) => {
          const revealed = state.revealedGroups.includes(group.id);
          return <button
            key={group.id}
            type="button"
            className={`route-button ${revealed ? 'is-revealed' : ''}`}
            aria-pressed={revealed}
            onClick={() => revealGroup(group.id)}
            disabled={state.completed}
          >
            <span>{revealed ? group.name : `Examinar ${group.name.toLocaleLowerCase('pt-BR')}`}</span>
            <strong>{revealed ? group.optionsLabel : '?'}</strong>
          </button>;
        })}
      </div>
    </section>

    <AnswerPanel
      challenge={challenge}
      ready={groupsReady}
      readyMessage={`Examine ${challenge.groups.length === 2 ? 'os dois grupos' : 'todos os grupos'} para liberar as respostas.`}
      selectedAnswer={state.selectedAnswer}
      hintVisible={state.hintVisible}
      feedback={state.feedback}
      completed={state.completed}
      prompt={<p className="challenge-equation">{challenge.equation}</p>}
      onSelect={(answer) => dispatch({ type: 'select-answer', answer })}
      onHint={() => dispatch({ type: 'show-hint' })}
      onConfirm={confirmAnswer}
    />
    {state.completed && <CompletionActions
      nextHref={nextChallenge ? `#/desafios/${nextChallenge.id}` : '#/conclusao'}
      nextLabel={nextChallenge ? `Continuar para ${nextChallenge.title}` : 'Ver resumo final'}
      onReplay={() => { dispatch({ type: 'reset' }); setGameRun((run) => run + 1); }}
    />}
  </>;
}
