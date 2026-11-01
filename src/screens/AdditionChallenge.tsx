import { useReducer, useState } from 'react';
import { additionRouteChallenge } from '../content/challenges';
import { ChallengeGame } from '../game/ChallengeGame';
import { createGameBridge } from '../game/bridge/events';
import { playFeedback } from '../audio/effects';
import { BotBubble, PixelButton } from '../ui/components';
import { additionChallengeInitialState, reduceAdditionChallenge } from './additionChallengeState';

export function AdditionChallenge() {
  const [state, dispatch] = useReducer(reduceAdditionChallenge, additionChallengeInitialState);
  const [bridge] = useState(createGameBridge);
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
    playFeedback(correct ? 'success' : 'error');
  };

  return <>
    <a className="back-link" href="#/setores">← Voltar ao mapa</a>
    <span className="eyebrow page-eyebrow">{additionRouteChallenge.sectorLabel}</span>
    <h1 tabIndex={-1}>{additionRouteChallenge.title}</h1>
    <BotBubble>{additionRouteChallenge.introduction}</BotBubble>

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

    <section className="answer-panel" aria-labelledby="equation-heading">
      <span className="eyebrow">Total de possibilidades</span>
      <h2 id="equation-heading" className="challenge-equation">3 + 4 = ?</h2>
      {!routesReady && <p className="unlock-note">Examine as duas rotas para liberar as respostas.</p>}
      <fieldset className="answer-options" disabled={!routesReady || state.completed} aria-label="Escolha uma resposta">
        <legend className="sr-only">Escolha uma resposta</legend>
        {additionRouteChallenge.answers.map((answer) => <label key={answer} className={state.selectedAnswer === answer ? 'is-selected' : ''}>
          <input
            type="radio"
            name="answer"
            value={answer}
            checked={state.selectedAnswer === answer}
            onChange={() => dispatch({ type: 'select-answer', answer })}
          />
          <span>{answer}</span>
        </label>)}
      </fieldset>
      <div className="challenge-actions">
        <PixelButton
          className="secondary"
          onClick={() => dispatch({ type: 'show-hint' })}
          disabled={state.completed}
          aria-controls="addition-challenge-hint"
          aria-expanded={state.hintVisible && !state.completed}
        >Ver dica <span aria-hidden="true">?</span></PixelButton>
        <PixelButton className="primary" onClick={confirmAnswer} disabled={state.selectedAnswer === null || state.completed}>Confirmar <span aria-hidden="true">→</span></PixelButton>
      </div>
    </section>

    <aside id="addition-challenge-hint" className="challenge-hint" aria-live="polite">
      {state.hintVisible && !state.completed && <><span className="eyebrow">Dica do B.O.T.</span><p>{additionRouteChallenge.hint}</p></>}
    </aside>
    <div className={`challenge-feedback ${state.completed ? 'is-success' : ''}`} role="status" aria-live="polite" aria-atomic="true">
      {state.feedback && <p>{state.feedback}</p>}
    </div>
    {state.completed && <PixelButton className="primary w-full" onClick={() => { window.location.hash = '/setores'; }}>Continuar <span aria-hidden="true">→</span></PixelButton>}
  </>;
}
