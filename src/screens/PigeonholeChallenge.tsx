import { useReducer, useState } from 'react';
import { useStore } from 'zustand';
import type { PigeonholeChallengeDefinition } from '../content/challenges';
import { getNextChallenge } from '../content/challenges';
import { playFeedback } from '../audio/effects';
import { ChallengeGame } from '../game/ChallengeGame';
import { createGameBridge } from '../game/bridge/events';
import { BotPortrait } from '../ui/components';
import { appStore } from '../state/store';
import { AnswerPanel, ChallengeIntro, CompletionActions } from './ChallengeComponents';
import {
  createPigeonholeChallengeState,
  reducePigeonholeChallenge,
} from './pigeonholeChallengeState';

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function PigeonholeChallenge({ challenge }: { challenge: PigeonholeChallengeDefinition }) {
  const [state, dispatch] = useReducer(
    (current: ReturnType<typeof createPigeonholeChallengeState>, action: Parameters<typeof reducePigeonholeChallenge>[1]) => reducePigeonholeChallenge(current, action, challenge),
    challenge,
    createPigeonholeChallengeState,
  );
  const [bridge] = useState(createGameBridge);
  const [lastBoxIndex, setLastBoxIndex] = useState<number | null>(null);
  const [gameRun, setGameRun] = useState(0);
  const completeChallenge = useStore(appStore, (store) => store.completeChallenge);
  const target = challenge.targetOccupancy;
  const lineLimit = target === undefined ? undefined : target - 1;
  const nextChallenge = getNextChallenge(challenge.id);
  const boxNames = challenge.boxNames ?? Array.from({ length: challenge.boxes }, (_, index) => `${challenge.boxLabel} ${index + 1}`);
  const boxNameAt = (index: number) => boxNames[index] ?? `${challenge.boxLabel} ${index + 1}`;

  const placeItem = (boxIndex: number) => {
    if (state.remaining === 0 || state.completed) return;
    dispatch({ type: 'place-item', boxIndex });
    setLastBoxIndex(boxIndex);
    playFeedback('place');
  };

  const resetDistribution = () => {
    dispatch({ type: 'reset-distribution' });
    setLastBoxIndex(null);
    bridge.emit('challenge:distribution-reset', { items: challenge.items });
  };

  const confirmAnswer = () => {
    if (state.selectedAnswer === null) return;
    const correct = state.selectedAnswer === challenge.correctAnswer;
    dispatch({ type: 'confirm-answer' });
    bridge.emit('challenge:answer-evaluated', { answer: state.selectedAnswer, correct });
    if (correct) completeChallenge(challenge.id);
    playFeedback(correct ? (appStore.getState().allChallengesCompleted ? 'complete' : 'success') : 'error');
  };

  const balancedDistribution = Array.from({ length: challenge.boxes }, (_, index) =>
    Math.floor(challenge.items / challenge.boxes) + (index < challenge.items % challenge.boxes ? 1 : 0));
  const balancedText = balancedDistribution.join('–');
  const boxTitle = (boxName: string, index: number) => challenge.boxNames
    ? `${challenge.boxLabel === 'categoria' ? 'Categoria ' : ''}${boxName}`
    : `${challenge.boxLabel.charAt(0).toLocaleUpperCase('pt-BR')}${challenge.boxLabel.slice(1)} ${index + 1}`;
  const boxArticle = challenge.boxLabel === 'compartimento' ? 'no' : 'na';

  return <>
    <ChallengeIntro challenge={challenge} />
    <ChallengeGame
      key={gameRun}
      kind="pigeonhole"
      bridge={bridge}
      challenge={challenge}
      counts={state.counts}
      remaining={state.remaining}
      lastBoxIndex={lastBoxIndex}
      completed={state.completed}
    />
    <section className="storage-board" aria-labelledby={`${challenge.id}-storage-heading`}>
      <div className="storage-heading">
        <h2 id={`${challenge.id}-storage-heading`}>{target ? "Simule o cenário-limite" : `Distribua ${challenge.itemPlural}`}</h2>
        <strong aria-live="polite">{target ? `${challenge.items - state.remaining} lotes registrados` : pluralize(state.remaining, `${challenge.itemLabel} restante`, `${challenge.itemPlural} restantes`)}</strong>
      </div>
      {lineLimit !== undefined && <p className="distribution-summary">
        Limite nesta simulação: {lineLimit} lotes por linha. Toque em uma linha para preenchê-la.
      </p>}
      <div className="box-grid">
        {state.counts.map((count, index) => {
          const itemCountLabel = pluralize(count, challenge.itemLabel, challenge.itemPlural);
          const boxName = boxNameAt(index);
          const actionTarget = challenge.boxNames
            ? `${challenge.boxLabel} ${boxName}`
            : boxName.toLocaleLowerCase('pt-BR');
          const full = lineLimit !== undefined && count >= lineLimit;
          const actionLabel = full ? 'Limite atingido' : state.remaining === 0
            ? 'Distribuição concluída'
            : lineLimit !== undefined ? `Preencher ${actionTarget}` : `Colocar ${challenge.itemLabel} ${boxArticle} ${actionTarget}`;
          return <button
            type="button"
            key={index}
            onClick={() => placeItem(index)}
            disabled={state.remaining === 0 || state.completed || full}
            aria-label={`${boxTitle(boxName, index)}: ${itemCountLabel}. ${actionLabel}`}
          >
            <span>{boxTitle(boxName, index)}</span>
            <b>{'■ '.repeat(Math.min(count, lineLimit ?? 10)).trim() || 'vazia'}</b>
            <strong>{itemCountLabel}</strong>
          </button>;
        })}
      </div>
      <p className="distribution-summary" aria-live="polite" aria-atomic="true">
        Distribuição atual: {state.counts.map((count, index) => `${boxTitle(boxNameAt(index), index).toLocaleLowerCase('pt-BR')} com ${pluralize(count, challenge.itemLabel, challenge.itemPlural)}`).join('; ')}.
      </p>
      <button
        className="reset-distribution"
        type="button"
        onClick={resetDistribution}
        disabled={state.completed || state.remaining === challenge.items}
      >Reiniciar distribuição</button>
    </section>

    <AnswerPanel
      challenge={challenge}
      ready={state.remaining === 0}
      readyMessage={target ? 'Preencha as sete linhas até o limite para liberar as respostas.'
        : `Distribua ${challenge.items} ${challenge.itemPlural} para liberar as respostas.`}
      selectedAnswer={state.selectedAnswer}
      hintVisible={state.hintVisible}
      feedback={state.feedback}
      completed={state.completed}
      questionContent={target && <>Qual é o <strong>menor número</strong> de lotes que a fábrica precisa registrar para <strong>garantir</strong> que pelo menos uma das 7 linhas de produção tenha 12 lotes ou mais?</>}
      prompt={!target && <p className="challenge-equation">{challenge.equation}</p>}
      onSelect={(answer) => dispatch({ type: 'select-answer', answer })}
      onHint={() => dispatch({ type: 'show-hint' })}
      onConfirm={confirmAnswer}
    />

    {state.completed && target && <div className="limit-distribution production-result">
      <BotPortrait />
      <div>
        <strong>{challenge.equation}</strong>
        <p>Com 11 lotes por linha, cabem 7 × 11 = 77 lotes sem alcançar a meta. O lote seguinte pode ir para qualquer linha. Na simulação, a linha 1 recebe esse lote e chega a 12.</p>
        <p>Na fórmula N = m(k − 1) + 1, m é o número de linhas, k é a meta por linha e N é o menor total que garante a meta.</p>
      </div>
    </div>}
    {state.completed && !target && <div className="limit-distribution">
      <strong>Distribuição-limite: {balancedText}</strong>
      <p>{balancedText} mostra que não podemos garantir {challenge.correctAnswer + 1}, embora sempre possamos garantir pelo menos {challenge.correctAnswer} em algum grupo.</p>
    </div>}

    {state.completed && <CompletionActions
      nextHref={nextChallenge ? `#/desafios/${nextChallenge.id}` : '#/conclusao'}
      nextLabel={nextChallenge ? `Continuar para ${nextChallenge.title}` : 'Ver resumo final'}
      onReplay={() => {
        dispatch({ type: 'reset' });
        setLastBoxIndex(null);
        setGameRun((run) => run + 1);
      }}
    />}
  </>;
}
