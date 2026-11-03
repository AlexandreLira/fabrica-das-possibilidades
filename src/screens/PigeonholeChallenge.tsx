import { useReducer } from 'react';
import { useStore } from 'zustand';
import { pigeonholeStorageChallenge } from '../content/challenges';
import { playFeedback } from '../audio/effects';
import { appStore } from '../state/store';
import { AnswerPanel, ChallengeIntro, CompletionActions } from './ChallengeComponents';
import {
  pigeonholeChallengeInitialState,
  reducePigeonholeChallenge,
  type BoxIndex,
} from './pigeonholeChallengeState';

export function PigeonholeChallenge() {
  const [state, dispatch] = useReducer(reducePigeonholeChallenge, pigeonholeChallengeInitialState);
  const completeChallenge = useStore(appStore, (store) => store.completeChallenge);

  const placeItem = (boxIndex: BoxIndex) => {
    if (state.remaining === 0 || state.completed) return;
    dispatch({ type: 'place-item', boxIndex });
    playFeedback('reveal');
  };

  const confirmAnswer = () => {
    if (state.selectedAnswer === null) return;
    const correct = state.selectedAnswer === pigeonholeStorageChallenge.correctAnswer;
    dispatch({ type: 'confirm-answer' });
    if (correct) completeChallenge(pigeonholeStorageChallenge.id);
    playFeedback(correct ? 'success' : 'error');
  };

  return <>
    <ChallengeIntro challenge={pigeonholeStorageChallenge} />
    <section className="storage-board" aria-labelledby="storage-heading">
      <div className="storage-heading">
        <h2 id="storage-heading">Distribua as peças</h2>
        <strong aria-live="polite">{state.remaining} {state.remaining === 1 ? 'peça restante' : 'peças restantes'}</strong>
      </div>
      <div className="box-grid">
        {state.counts.map((count, index) => <button
          type="button"
          key={index}
          onClick={() => placeItem(index as BoxIndex)}
          disabled={state.remaining === 0 || state.completed}
          aria-label={`Colocar peça na caixa ${index + 1}`}
        >
          <span>Caixa {index + 1}</span>
          <b>{'■ '.repeat(count).trim() || 'vazia'}</b>
          <strong>{count} {count === 1 ? 'peça' : 'peças'}</strong>
        </button>)}
      </div>
      <button
        className="reset-distribution"
        type="button"
        onClick={() => dispatch({ type: 'reset-distribution' })}
        disabled={state.completed || state.remaining === pigeonholeStorageChallenge.items}
      >Reiniciar distribuição</button>
    </section>

    <AnswerPanel
      challenge={pigeonholeStorageChallenge}
      ready={state.remaining === 0}
      readyMessage="Distribua as sete peças para liberar as respostas."
      selectedAnswer={state.selectedAnswer}
      hintVisible={state.hintVisible}
      feedback={state.feedback}
      completed={state.completed}
      prompt={<p className="challenge-equation">⌈7 ÷ 3⌉ = ?</p>}
      onSelect={(answer) => dispatch({ type: 'select-answer', answer })}
      onHint={() => dispatch({ type: 'show-hint' })}
      onConfirm={confirmAnswer}
    />

    {state.completed && <>
      <div className="limit-distribution">
        <strong>Distribuição-limite: 3–2–2</strong>
        <p>3–2–2 mostra que não podemos garantir 4, embora sempre possamos garantir pelo menos 3 em alguma caixa.</p>
      </div>
      <CompletionActions
        nextHref="#/conclusao"
        nextLabel="Ver resumo final"
        onReplay={() => dispatch({ type: 'reset' })}
      />
    </>}
  </>;
}
