import { useReducer, useState } from 'react';
import { useStore } from 'zustand';
import { pigeonholeStorageChallenge } from '../content/challenges';
import { playFeedback } from '../audio/effects';
import { ChallengeGame } from '../game/ChallengeGame';
import { createGameBridge } from '../game/bridge/events';
import { appStore } from '../state/store';
import { AnswerPanel, ChallengeIntro, CompletionActions } from './ChallengeComponents';
import {
  pigeonholeChallengeInitialState,
  reducePigeonholeChallenge,
  type BoxIndex,
} from './pigeonholeChallengeState';

export function PigeonholeChallenge() {
  const [state, dispatch] = useReducer(reducePigeonholeChallenge, pigeonholeChallengeInitialState);
  const [bridge] = useState(createGameBridge);
  const [lastBoxIndex, setLastBoxIndex] = useState<BoxIndex | null>(null);
  const [gameRun, setGameRun] = useState(0);
  const completeChallenge = useStore(appStore, (store) => store.completeChallenge);
  const completedChallengeIds = useStore(appStore, (store) => store.completedChallengeIds);

  const placeItem = (boxIndex: BoxIndex) => {
    if (state.remaining === 0 || state.completed) return;
    dispatch({ type: 'place-item', boxIndex });
    setLastBoxIndex(boxIndex);
    playFeedback('place');
  };

  const resetDistribution = () => {
    dispatch({ type: 'reset-distribution' });
    setLastBoxIndex(null);
    bridge.emit('challenge:distribution-reset', undefined);
  };

  const confirmAnswer = () => {
    if (state.selectedAnswer === null) return;
    const correct = state.selectedAnswer === pigeonholeStorageChallenge.correctAnswer;
    dispatch({ type: 'confirm-answer' });
    bridge.emit('challenge:answer-evaluated', { answer: state.selectedAnswer, correct });
    if (correct) completeChallenge(pigeonholeStorageChallenge.id);
    const completesDemo = completedChallengeIds.includes('adicao-1') && completedChallengeIds.includes('multiplicacao-1');
    playFeedback(correct ? (completesDemo ? 'complete' : 'success') : 'error');
  };

  return <>
    <ChallengeIntro challenge={pigeonholeStorageChallenge} />
    <ChallengeGame
      key={gameRun}
      kind="pigeonhole"
      bridge={bridge}
      counts={state.counts}
      remaining={state.remaining}
      lastBoxIndex={lastBoxIndex}
      completed={state.completed}
    />
    <section className="storage-board" aria-labelledby="storage-heading">
      <div className="storage-heading">
        <h2 id="storage-heading">Distribua as peças</h2>
        <strong aria-live="polite">{state.remaining} {state.remaining === 1 ? 'peça restante' : 'peças restantes'}</strong>
      </div>
      <div className="box-grid">
        {state.counts.map((count, index) => {
          const countLabel = `${count} ${count === 1 ? 'peça' : 'peças'}`;
          const actionLabel = state.remaining === 0 ? 'Distribuição concluída' : `Colocar peça na caixa ${index + 1}`;
          return <button
            type="button"
            key={index}
            onClick={() => placeItem(index as BoxIndex)}
            disabled={state.remaining === 0 || state.completed}
            aria-label={`Caixa ${index + 1}: ${countLabel}. ${actionLabel}`}
          >
            <span>Caixa {index + 1}</span>
            <b>{'■ '.repeat(count).trim() || 'vazia'}</b>
            <strong>{countLabel}</strong>
          </button>;
        })}
      </div>
      <p className="distribution-summary" aria-live="polite" aria-atomic="true">
        Distribuição atual: {state.counts.map((count, index) => `caixa ${index + 1} com ${count} ${count === 1 ? 'peça' : 'peças'}`).join('; ')}.
      </p>
      <button
        className="reset-distribution"
        type="button"
        onClick={resetDistribution}
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
        onReplay={() => {
          dispatch({ type: 'reset' });
          setLastBoxIndex(null);
          setGameRun((run) => run + 1);
        }}
      />
    </>}
  </>;
}
