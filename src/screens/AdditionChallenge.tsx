import { useReducer, useState } from 'react';
import { useStore } from 'zustand';
import { additionRouteChallenge } from '../content/challenges';
import { ChallengeGame } from '../game/ChallengeGame';
import { createGameBridge } from '../game/bridge/events';
import { playFeedback } from '../audio/effects';
import { appStore } from '../state/store';
import { AnswerPanel, ChallengeIntro, CompletionActions } from './ChallengeComponents';
import { additionChallengeInitialState, reduceAdditionChallenge } from './additionChallengeState';

export function AdditionChallenge() {
  const [state, dispatch] = useReducer(reduceAdditionChallenge, additionChallengeInitialState);
  const [bridge] = useState(createGameBridge);
  const completeChallenge = useStore(appStore, (store) => store.completeChallenge);
  const routesReady = state.revealedRoutes.length === additionRouteChallenge.groups.length;

  const revealRoute = (routeId: 'local' | 'express') => {
    dispatch({ type: 'reveal-route', routeId });
    playFeedback('reveal');
  };

  const confirmAnswer = () => {
    if (state.selectedAnswer === null) return;
    const correct = state.selectedAnswer === additionRouteChallenge.correctAnswer;
    dispatch({ type: 'confirm-answer' });
    bridge.emit('challenge:answer-evaluated', { answer: state.selectedAnswer, correct });
    if (correct) completeChallenge(additionRouteChallenge.id);
    playFeedback(correct ? 'success' : 'error');
  };

  return <>
    <ChallengeIntro challenge={additionRouteChallenge} />

    <ChallengeGame bridge={bridge} revealedRoutes={state.revealedRoutes} completed={state.completed} />

    <section className="challenge-routes" aria-labelledby="route-heading">
      <h2 id="route-heading">Examine as rotas</h2>
      <div className="route-grid">
        {additionRouteChallenge.groups.map((group) => {
          const revealed = state.revealedRoutes.includes(group.id);
          return <button
            key={group.id}
            type="button"
            className={`route-button ${revealed ? 'is-revealed' : ''}`}
            aria-pressed={revealed}
            onClick={() => revealRoute(group.id)}
            disabled={state.completed}
          >
            <span>{revealed ? group.name : `Examinar ${group.name.toLocaleLowerCase('pt-BR')}`}</span>
            <strong>{revealed ? group.optionsLabel : '?'}</strong>
          </button>;
        })}
      </div>
    </section>

    <AnswerPanel
      challenge={additionRouteChallenge}
      ready={routesReady}
      readyMessage="Examine as duas rotas para liberar as respostas."
      selectedAnswer={state.selectedAnswer}
      hintVisible={state.hintVisible}
      feedback={state.feedback}
      completed={state.completed}
      prompt={<p className="challenge-equation">3 + 4 = ?</p>}
      onSelect={(answer) => dispatch({ type: 'select-answer', answer })}
      onHint={() => dispatch({ type: 'show-hint' })}
      onConfirm={confirmAnswer}
    />
    {state.completed && <CompletionActions
      nextHref="#/desafios/multiplicacao-1"
      nextLabel="Continuar para Multiplicação"
      onReplay={() => dispatch({ type: 'reset' })}
    />}
  </>;
}
