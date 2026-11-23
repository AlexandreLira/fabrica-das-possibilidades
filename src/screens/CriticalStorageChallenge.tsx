import { useEffect, useState, type CSSProperties } from 'react';
import type { CriticalStorageChallengeDefinition } from '../content/challenges';
import {
  criticalStorageBins, criticalStorageLimit, criticalStorageTarget, drawStoragePiece,
} from '../domain/math/criticalStorage';
import { playFeedback } from '../audio/effects';
import { appStore } from '../state/store';
import { BotPortrait, PixelButton } from '../ui/components';
import { AnswerPanel, ChallengeIntro, CompletionActions } from './ChallengeComponents';

const emptyTray = criticalStorageBins.map(() => 0);
const [blue, green, red, yellow, white] = criticalStorageBins;
const stockDescription = `O depósito começa com ${blue.stock} peças azuis, ${green.stock} verdes, ${red.stock} vermelhas, ${yellow.stock} amarelas e ${white.stock} brancas.`;
const stockTotal = criticalStorageBins.reduce((sum, { stock }) => sum + stock, 0);
const exampleBin = criticalStorageBins.findIndex(({ stock }) => stock >= criticalStorageTarget);
const limitTotal = criticalStorageLimit.reduce((sum, count) => sum + count, 0);
const exampleTray = criticalStorageLimit.map((count, index) => count + Number(index === exampleBin));

function PieceTray({ counts, demonstrate = false }: { counts: readonly number[]; demonstrate?: boolean }) {
  return <ul className={`critical-bins ${demonstrate ? 'critical-demo-bins' : ''}`}>
    {criticalStorageBins.map(({ name, stock, color }, index) => {
      const count = counts[index] ?? 0;
      return <li key={name} className={count >= criticalStorageTarget ? 'reached-target' : ''}
        style={{ '--piece-color': color, '--bin-delay': `${index * 100}ms` } as CSSProperties}>
        <strong>{name}</strong>
        <span>Estoque restante: {stock - count}</span>
        <span>Na bandeja: {count}</span>
        <div className="critical-pieces" aria-hidden="true">
          {Array.from({ length: count }, (_, piece) => <i key={piece} />)}
        </div>
      </li>;
    })}
  </ul>;
}

function StorageDemonstration() {
  const [extraDrawn, setExtraDrawn] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setExtraDrawn(true), 1150);
    return () => window.clearTimeout(timer);
  }, []);

  return <section className="critical-explanation" aria-labelledby="critical-explanation-title">
    <div className="critical-celebration"><BotPortrait /><h2 id="critical-explanation-title">Do pior cenário à garantia</h2></div>
    <p>Com 6 azuis, 8 verdes e 9 de cada uma das outras três cores, ainda é possível retirar <strong>41 peças</strong> sem chegar a 10 da mesma cor.</p>
    <div className="critical-machine" aria-hidden="true">
      <span key={String(extraDrawn)} className="critical-arm is-moving"
        style={{ '--piece-color': extraDrawn ? criticalStorageBins[exampleBin]?.color : '#f4c955' } as CSSProperties} />
    </div>
    <PieceTray counts={extraDrawn ? exampleTray : criticalStorageLimit} demonstrate />
    <p className="critical-count" aria-live="polite">{extraDrawn ? limitTotal + 1 : limitTotal} peças retiradas na demonstração</p>
    <p>No cenário de 41, azul e verde já acabaram. A próxima peça leva uma das três cores restantes de 9 para 10. A demonstração usa a vermelha como exemplo.</p>
    <p className="challenge-equation four-terms">6 + 8 + 3 × 9 + 1 = 42</p>
  </section>;
}

export function CriticalStorageChallenge({ challenge }: { challenge: CriticalStorageChallengeDefinition }) {
  const [counts, setCounts] = useState<readonly number[]>(emptyTray);
  const [explored, setExplored] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [lastDraw, setLastDraw] = useState<string | null>(null);
  const [firstTargetDraw, setFirstTargetDraw] = useState<number | null>(null);
  const totalDrawn = counts.reduce((sum, count) => sum + count, 0);

  const draw = () => {
    if (completed || totalDrawn === stockTotal) return;
    const next = drawStoragePiece(counts, Math.random());
    const picked = next.findIndex((count, index) => count > (counts[index] ?? 0));
    setLastDraw(criticalStorageBins[picked]?.color ?? null);
    setCounts(next);
    if (firstTargetDraw === null && next.some((count) => count >= criticalStorageTarget)) {
      setFirstTargetDraw(totalDrawn + 1);
    }
    setExplored(true);
    playFeedback('place');
  };

  const resetTray = () => {
    setCounts(emptyTray);
    setLastDraw(null);
    setFirstTargetDraw(null);
  };

  const confirm = () => {
    if (!explored || answer === null || completed) return;
    if (answer === challenge.correctAnswer) {
      setCompleted(true);
      setFeedback(challenge.successExplanation);
      appStore.getState().completeChallenge(challenge.id);
      playFeedback('complete');
    } else {
      setFeedback(challenge.feedback[answer] ?? '');
      setAnswer(null);
      playFeedback('error');
    }
  };

  const replay = () => {
    resetTray();
    setExplored(false);
    setAnswer(null);
    setHintVisible(false);
    setFeedback('');
    setCompleted(false);
  };

  return <>
    <ChallengeIntro challenge={challenge} />
    <section className="critical-storage" aria-labelledby="critical-storage-title">
      <h2 id="critical-storage-title">Simulador de retiradas</h2>
      <p>Meta: <strong>10 peças da mesma cor.</strong> {stockDescription}</p>
      <div className="critical-machine" aria-hidden="true">
        <span key={totalDrawn} className={`critical-arm ${lastDraw ? 'is-moving' : ''}`}
          style={{ '--piece-color': lastDraw ?? 'transparent' } as CSSProperties} />
      </div>
      <PieceTray counts={counts} />
      <p className="critical-count" aria-live="polite">{totalDrawn === 1 ? '1 peça retirada' : `${totalDrawn} peças retiradas`}
      </p>
      <p className="critical-trial-note" aria-live="polite">
        {firstTargetDraw === null
          ? 'Cada simulação mostra uma ordem possível. O desafio pede um total que funcione em todas as ordens.'
          : `Nesta rodada, você chegou a 10 da mesma cor com ${firstTargetDraw} retiradas. Em outra ordem, pode demorar mais.`}
      </p>
      <div className="challenge-actions">
        <PixelButton className="secondary" type="button" onClick={resetTray} disabled={completed || totalDrawn === 0}>Reiniciar retirada</PixelButton>
        <PixelButton className="primary" type="button" onClick={draw} disabled={completed || totalDrawn === stockTotal}>Retirar peça</PixelButton>
      </div>
    </section>

    <AnswerPanel challenge={challenge} ready={explored} readyMessage="Retire uma peça para liberar as respostas."
      questionContent={<>{stockDescription} Retirando peças às cegas, sem reposição, qual é o <strong>menor número</strong> que garante 10 ou mais da mesma cor <strong>em qualquer ordem de retirada</strong>?</>}
      selectedAnswer={answer} hintVisible={hintVisible} feedback={feedback} completed={completed}
      confirmLabel="Enviar Resposta" onSelect={(value) => { setAnswer(value); setFeedback(''); }}
      onHint={() => setHintVisible(true)} onConfirm={confirm}
    />

    {completed && <>
      <StorageDemonstration />
      <CompletionActions nextHref="#/conclusao" nextLabel="Ver resumo final" onReplay={replay} />
    </>}
  </>;
}
