import { useReducer, useState } from 'react';
import type { CSSProperties } from 'react';
import { useStore } from 'zustand';
import type { MultiplicationChallengeDefinition, MultiplicationOption } from '../content/challenges';
import { getNextChallenge } from '../content/challenges';
import { RobotAssemblyArt, RobotPartThumbnail } from '../game/CompleteRobotArt';
import { getMultiplicationArtId } from '../game/completeRobotParts';
import { ChallengeGame } from '../game/ChallengeGame';
import { createGameBridge } from '../game/bridge/events';
import { playFeedback } from '../audio/effects';
import { appStore } from '../state/store';
import { AnswerPanel, ChallengeIntro, CompletionActions } from './ChallengeComponents';
import {
  createMultiplicationChallengeState,
  reduceMultiplicationChallenge,
} from './multiplicationChallengeState';

export function MultiplicationChallenge({ challenge }: { challenge: MultiplicationChallengeDefinition }) {
  const [state, dispatch] = useReducer(
    (current: ReturnType<typeof createMultiplicationChallengeState>, action: Parameters<typeof reduceMultiplicationChallenge>[1]) => reduceMultiplicationChallenge(current, action, challenge),
    createMultiplicationChallengeState(),
  );
  const [bridge] = useState(createGameBridge);
  const [gameRun, setGameRun] = useState(0);
  const completeChallenge = useStore(appStore, (store) => store.completeChallenge);
  const showAssembledCombinations = challenge.id === 'multiplicacao-2';
  const completeRobot = challenge.visual === 'complete-robot';
  const ready = challenge.stages.every((stage) => Boolean(state.selections[stage.id]));
  const selectedOptions = challenge.stages.map((stage) => stage.options.find((option) => option.id === state.selections[stage.id]));
  const bodyVariant = challenge.stages.find(({ id }) => id === 'corpo')?.options.findIndex(({ id }) => id === state.selections.corpo) ?? -1;
  const nextChallenge = getNextChallenge(challenge.id);

  const confirmAnswer = () => {
    if (state.selectedAnswer === null) return;
    const correct = state.selectedAnswer === challenge.correctAnswer;
    dispatch({ type: 'confirm-answer' });
    bridge.emit('challenge:answer-evaluated', { answer: state.selectedAnswer, correct });
    if (correct) completeChallenge(challenge.id);
    playFeedback(correct ? ((completeRobot || appStore.getState().allChallengesCompleted) ? 'complete' : 'success') : 'error');
  };

  const combinations = challenge.visual === 'robot'
    ? challenge.stages.reduce<MultiplicationOption[][]>(
      (partials, stage) => partials.flatMap((partial) => stage.options.map((option) => [...partial, option])),
      [[]],
    )
    : [];

  return <>
    <ChallengeIntro challenge={challenge} />
    <ChallengeGame key={gameRun} kind="multiplication" bridge={bridge} challenge={challenge} selections={state.selections} completed={state.completed} />
    <section className="robot-workbench" aria-labelledby={`${challenge.id}-workbench-heading`}>
      <h2 id={`${challenge.id}-workbench-heading`}>{challenge.visual === 'routes' ? 'Escolha um caminho em cada setor' : 'Escolha as opções'}</h2>
      {challenge.visual === 'robot'
        ? <div className="robot-preview" aria-live="polite">
          <RobotAssemblyArt stages={challenge.stages} selections={state.selections} completed={state.completed} completeRobot={false} />
          <p>{selectedOptions.every(Boolean)
            ? selectedOptions.map((option) => option?.name).join(' + ')
            : `Escolha ${challenge.stages.map((stage) => stage.name.toLocaleLowerCase('pt-BR')).join(' e ')}`}</p>
        </div>
        : <ol className={completeRobot ? "route-preview robot-parts-summary" : "route-preview"} aria-live="polite">
          {challenge.stages.map((stage, index) => <li key={stage.id}>
            <span>{stage.name}</span>
            {challenge.visual === 'routes' && selectedOptions[index] && <RobotPartThumbnail
              stageId={stage.id} variant={stage.options.findIndex(({ id }) => id === state.selections[stage.id])}
              color={selectedOptions[index].color} bodyVariant={0} />}
            <strong>{selectedOptions[index]?.name ?? (completeRobot ? 'Selecione uma peça' : 'Escolha um caminho')}</strong>
          </li>)}
        </ol>}
      {challenge.stages.map((stage) => <fieldset className="part-options" key={stage.id} disabled={state.completed}>
        <legend>{stage.name}</legend>
        <div className="part-options-grid" style={{ '--option-count': Math.min(stage.options.length, 3) } as CSSProperties}>
          {stage.options.map((option, index) => <button
            key={option.id}
            type="button"
            aria-pressed={state.selections[stage.id] === option.id}
            className={state.selections[stage.id] === option.id ? 'is-selected' : ''}
            onClick={() => {
              dispatch({ type: 'select-option', stageId: stage.id, optionId: option.id });
              bridge.emit('challenge:stage-selected', { stageId: stage.id, optionId: option.id });
              playFeedback('select');
            }}
          >
            <RobotPartThumbnail stageId={getMultiplicationArtId(stage.id, challenge.visual)}
              variant={index} color={option.color} bodyVariant={Math.max(0, bodyVariant)} />
            {option.name}
          </button>)}
        </div>
      </fieldset>)}
    </section>

    <AnswerPanel
      challenge={challenge}
      ready={ready}
      readyMessage="Escolha uma opção em cada etapa para liberar as respostas."
      selectedAnswer={state.selectedAnswer}
      hintVisible={state.hintVisible}
      feedback={state.feedback}
      completed={state.completed}
      confirmLabel={completeRobot ? 'Enviar Resposta' : undefined}
      prompt={<p className={completeRobot ? "challenge-equation four-terms" : "challenge-equation"}>
        {completeRobot && state.completed ? challenge.equation.replace('?', String(challenge.correctAnswer)) : challenge.equation}
      </p>}
      onSelect={(answer) => dispatch({ type: 'select-answer', answer })}
      onHint={() => dispatch({ type: 'show-hint' })}
      onConfirm={confirmAnswer}
    />

    {state.completed && challenge.visual === 'robot' && <ul className={showAssembledCombinations ? "combination-grid assembled-combinations" : "combination-grid"} aria-label={`${challenge.correctAnswer} modelos possíveis`}>
      {combinations.map((combination) => <li key={combination.map((option) => option.id).join('-')}>
        {showAssembledCombinations
          ? <RobotAssemblyArt
            stages={challenge.stages}
            selections={Object.fromEntries(challenge.stages.map((stage, index) => [stage.id, combination[index]!.id]))}
            completed={false}
            completeRobot={false}
            thumbnail
          />
          : combination[0]?.color && <i style={{ background: combination[0].color }} aria-hidden="true" />}
        <span>{combination.map((option) => option.name).join(' + ')}</span>
      </li>)}
    </ul>}

    {state.completed && <CompletionActions
      nextHref={nextChallenge ? `#/desafios/${nextChallenge.id}` : '#/conclusao'}
      nextLabel={nextChallenge ? `Continuar para ${nextChallenge.title}` : 'Ver resumo final'}
      onReplay={() => { dispatch({ type: 'reset' }); setGameRun((run) => run + 1); }}
    />}
  </>;
}
