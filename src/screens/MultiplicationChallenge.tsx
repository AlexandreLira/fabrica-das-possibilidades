import { useReducer } from 'react';
import { useStore } from 'zustand';
import { multiplicationRobotChallenge } from '../content/challenges';
import { playFeedback } from '../audio/effects';
import { appStore } from '../state/store';
import { AnswerPanel, ChallengeIntro, CompletionActions } from './ChallengeComponents';
import {
  multiplicationChallengeInitialState,
  reduceMultiplicationChallenge,
} from './multiplicationChallengeState';

export function MultiplicationChallenge() {
  const [state, dispatch] = useReducer(reduceMultiplicationChallenge, multiplicationChallengeInitialState);
  const completeChallenge = useStore(appStore, (store) => store.completeChallenge);
  const ready = state.bodyId !== null && state.antennaId !== null;
  const body = multiplicationRobotChallenge.bodyOptions.find((option) => option.id === state.bodyId);
  const antenna = multiplicationRobotChallenge.antennaOptions.find((option) => option.id === state.antennaId);

  const confirmAnswer = () => {
    if (state.selectedAnswer === null) return;
    const correct = state.selectedAnswer === multiplicationRobotChallenge.correctAnswer;
    dispatch({ type: 'confirm-answer' });
    if (correct) completeChallenge(multiplicationRobotChallenge.id);
    playFeedback(correct ? 'success' : 'error');
  };

  return <>
    <ChallengeIntro challenge={multiplicationRobotChallenge} />
    <section className="robot-workbench" aria-labelledby="robot-workbench-heading">
      <h2 id="robot-workbench-heading">Escolha as peças</h2>
      <div className="robot-preview" aria-live="polite">
        <span className="robot-antenna" aria-hidden="true">{antenna?.symbol ?? '?'}</span>
        <span className="robot-head" style={{ background: body?.color ?? '#38505d' }} aria-hidden="true">□</span>
        <p>{body && antenna ? `${body.name} com ${antenna.name.toLocaleLowerCase('pt-BR')}` : 'Escolha uma carcaça e uma antena'}</p>
      </div>
      <fieldset className="part-options" disabled={state.completed}>
        <legend>Carcaça</legend>
        {multiplicationRobotChallenge.bodyOptions.map((option) => <button
          key={option.id}
          type="button"
          aria-pressed={state.bodyId === option.id}
          className={state.bodyId === option.id ? 'is-selected' : ''}
          onClick={() => { dispatch({ type: 'select-body', bodyId: option.id }); playFeedback('reveal'); }}
        ><i style={{ background: option.color }} aria-hidden="true" />{option.name}</button>)}
      </fieldset>
      <fieldset className="part-options" disabled={state.completed}>
        <legend>Antena</legend>
        {multiplicationRobotChallenge.antennaOptions.map((option) => <button
          key={option.id}
          type="button"
          aria-pressed={state.antennaId === option.id}
          className={state.antennaId === option.id ? 'is-selected' : ''}
          onClick={() => { dispatch({ type: 'select-antenna', antennaId: option.id }); playFeedback('reveal'); }}
        ><b aria-hidden="true">{option.symbol}</b>{option.name}</button>)}
      </fieldset>
    </section>

    <AnswerPanel
      challenge={multiplicationRobotChallenge}
      ready={ready}
      readyMessage="Escolha uma carcaça e uma antena para liberar as respostas."
      selectedAnswer={state.selectedAnswer}
      hintVisible={state.hintVisible}
      feedback={state.feedback}
      completed={state.completed}
      prompt={<p className="challenge-equation">3 × 2 = ?</p>}
      onSelect={(answer) => dispatch({ type: 'select-answer', answer })}
      onHint={() => dispatch({ type: 'show-hint' })}
      onConfirm={confirmAnswer}
    />

    {state.completed && <>
      <ul className="combination-grid" aria-label="Seis modelos possíveis">
        {multiplicationRobotChallenge.bodyOptions.flatMap((bodyOption) =>
          multiplicationRobotChallenge.antennaOptions.map((antennaOption) =>
            <li key={`${bodyOption.id}-${antennaOption.id}`}>
              <i style={{ background: bodyOption.color }} aria-hidden="true" />
              <span>{bodyOption.name} + {antennaOption.name}</span>
            </li>))}
      </ul>
      <CompletionActions
        nextHref="#/desafios/casas-de-pombo-1"
        nextLabel="Continuar para Casas de Pombo"
        onReplay={() => dispatch({ type: 'reset' })}
      />
    </>}
  </>;
}
