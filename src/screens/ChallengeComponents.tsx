import { useState, type ReactNode } from 'react';
import type { ChallengeDefinition } from '../content/sectors';
import { BotBubble, PixelButton } from '../ui/components';

export function ChallengeIntro({ challenge }: { challenge: ChallengeDefinition }) {
  const [tutorialVisible, setTutorialVisible] = useState(true);
  return <>
    <a className="back-link" href="#/setores">← Voltar ao mapa</a>
    <span className="eyebrow page-eyebrow">{challenge.sectorLabel}</span>
    <h1 tabIndex={-1}>{challenge.title}</h1>
    <BotBubble>{challenge.introduction}</BotBubble>
    <section className="challenge-tutorial" aria-labelledby={`${challenge.id}-tutorial-title`}>
      <div className="tutorial-heading">
        <h2 id={`${challenge.id}-tutorial-title`}>Como jogar</h2>
        <PixelButton
          className="secondary tutorial-toggle"
          onClick={() => setTutorialVisible((visible) => !visible)}
          aria-expanded={tutorialVisible}
          aria-controls={`${challenge.id}-tutorial-steps`}
        >{tutorialVisible ? 'Ocultar tutorial' : 'Rever tutorial'}</PixelButton>
      </div>
      {tutorialVisible && <ol id={`${challenge.id}-tutorial-steps`}>
        {challenge.tutorial.map((step) => <li key={step}>{step}</li>)}
      </ol>}
    </section>
  </>;
}

interface AnswerPanelProps {
  challenge: ChallengeDefinition;
  ready: boolean;
  readyMessage: string;
  selectedAnswer: number | null;
  hintVisible: boolean;
  feedback: string;
  completed: boolean;
  prompt?: ReactNode;
  onSelect: (answer: number) => void;
  onHint: () => void;
  onConfirm: () => void;
}

export function AnswerPanel({
  challenge,
  ready,
  readyMessage,
  selectedAnswer,
  hintVisible,
  feedback,
  completed,
  prompt,
  onSelect,
  onHint,
  onConfirm,
}: AnswerPanelProps) {
  const hintId = `${challenge.id}-hint`;
  return <>
    <section className="answer-panel" aria-labelledby={`${challenge.id}-question`}>
      <span className="eyebrow">Desafio matemático</span>
      <h2 id={`${challenge.id}-question`} className="challenge-question">{challenge.question}</h2>
      {prompt}
      {!ready && <p className="unlock-note">{readyMessage}</p>}
      <fieldset className="answer-options" disabled={!ready || completed} aria-label="Escolha uma resposta">
        <legend className="sr-only">Escolha uma resposta</legend>
        {challenge.answers.map((answer) => <label key={answer} className={selectedAnswer === answer ? 'is-selected' : ''}>
          <input
            type="radio"
            name={`${challenge.id}-answer`}
            value={answer}
            checked={selectedAnswer === answer}
            onChange={() => onSelect(answer)}
          />
          <span>{answer}</span>
        </label>)}
      </fieldset>
      <div className="challenge-actions">
        <PixelButton
          className="secondary"
          onClick={onHint}
          disabled={completed}
          aria-controls={hintId}
          aria-expanded={hintVisible && !completed}
        >Ver dica <span aria-hidden="true">?</span></PixelButton>
        <PixelButton className="primary" onClick={onConfirm} disabled={selectedAnswer === null || completed}>
          Confirmar <span aria-hidden="true">→</span>
        </PixelButton>
      </div>
    </section>
    <aside id={hintId} className="challenge-hint" aria-live="polite">
      {hintVisible && !completed && <><span className="eyebrow">Dica do B.O.T.</span><p>{challenge.hint}</p></>}
    </aside>
    <div className={`challenge-feedback ${completed ? 'is-success' : ''}`} role="status" aria-live="polite" aria-atomic="true">
      {feedback && <p>{feedback}</p>}
    </div>
  </>;
}

export function CompletionActions({
  nextHref,
  nextLabel,
  onReplay,
}: {
  nextHref: string;
  nextLabel: string;
  onReplay: () => void;
}) {
  return <div className="completion-actions">
    <a className="pixel-button primary" href={nextHref}>{nextLabel} <span aria-hidden="true">→</span></a>
    <PixelButton className="secondary" onClick={onReplay}>Jogar novamente <span aria-hidden="true">↻</span></PixelButton>
    <a className="pixel-button secondary" href="#/setores">Voltar ao mapa <span aria-hidden="true">▦</span></a>
  </div>;
}
