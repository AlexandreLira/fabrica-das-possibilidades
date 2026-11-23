import { useState } from 'react';
import { getNextChallenge, type VaultChallengeDefinition } from '../content/challenges';
import {
  getVaultCodeError, vaultDigitCombinations, vaultDigits, vaultEndingInOtherEven, vaultEndingInZero, vaultLetters,
} from '../domain/math/vaultCode';
import { appStore } from '../state/store';
import { playFeedback } from '../audio/effects';
import { PixelButton } from '../ui/components';
import { AnswerPanel, ChallengeIntro, CompletionActions } from './ChallengeComponents';

const positions = ['Letra', '1º algarismo', '2º algarismo', '3º algarismo'];
const openingCodes = ['A120', 'C408', 'E372'];
const formatAnswer = new Intl.NumberFormat('pt-BR').format;

export function VaultChallenge({ challenge }: { challenge: VaultChallengeDefinition }) {
  const [code, setCode] = useState('');
  const [validation, setValidation] = useState<{ message: string; valid: boolean } | null>(null);
  const [tested, setTested] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const nextChallenge = getNextChallenge(challenge.id);

  const editCode = (value: string) => {
    setCode(value);
    setValidation(null);
    playFeedback('select');
  };

  const testCode = () => {
    const error = getVaultCodeError(code);
    setValidation({ message: error ?? 'Código válido. Todas as regras foram atendidas.', valid: error === null });
    setTested(true);
    playFeedback(error ? 'error' : 'success');
  };

  const confirmAnswer = () => {
    if (!tested || answer === null || completed) return;
    if (answer === challenge.correctAnswer) {
      setCompleted(true);
      setFeedback(challenge.successExplanation);
      appStore.getState().completeChallenge(challenge.id);
      playFeedback('complete');
    } else {
      setFeedback(challenge.feedback[answer] ?? '');
      setWrongAttempts((attempts) => attempts + 1);
      setAnswer(null);
      playFeedback('error');
    }
  };

  const replay = () => {
    setCode('');
    setValidation(null);
    setTested(false);
    setAnswer(null);
    setHintVisible(false);
    setFeedback('');
    setWrongAttempts(0);
    setCompleted(false);
  };

  return <>
    <ChallengeIntro challenge={challenge} />
    <section className={`vault-panel ${completed ? 'is-open' : ''}`} aria-labelledby="vault-heading">
      <h2 id="vault-heading">Painel do cofre</h2>
      <div className="vault-display">
        <div className="vault-slots" aria-label={completed ? 'Exemplo de código válido' : 'Código em teste'}>
          {positions.map((position, index) => <div key={position}>
            <span>{position}</span><strong>{(completed ? openingCodes[2] : code)?.[index] ?? '—'}</strong>
          </div>)}
        </div>
        {completed && <div className="vault-opening" aria-hidden="true">
          {openingCodes.map((sample, index) => <span key={sample} style={{ animationDelay: `${index * 180}ms` }}>{sample}</span>)}
        </div>}
      </div>
      {completed ? <p className="vault-valid">Cofre aberto</p> : <>
        <ul className="vault-rules">
          <li>Use uma letra de A a E.</li>
          <li>Use três algarismos diferentes.</li>
          <li>O primeiro algarismo não pode ser 0.</li>
          <li>O último deve ser par: 0, 2, 4, 6 ou 8.</li>
        </ul>
        <div className="vault-keypad" role="group" aria-label={code.length === 0 ? 'Letras' : 'Algarismos'}>
          {(code.length === 0 ? vaultLetters : vaultDigits).map((key) => <button
            key={key} type="button" disabled={code.length === positions.length} onClick={() => editCode(code + key)}
          >{key}</button>)}
        </div>
        <div className="vault-controls">
          <PixelButton className="secondary" type="button" disabled={!code} onClick={() => editCode(code.slice(0, -1))}>Apagar</PixelButton>
          <PixelButton className="primary" type="button" disabled={code.length !== positions.length} onClick={testCode}>Testar código</PixelButton>
        </div>
        <p className={`vault-validation ${validation?.valid ? 'vault-valid' : 'vault-invalid'}`} aria-live="polite">
          {validation?.message}
        </p>
      </>}
    </section>

    <AnswerPanel
      challenge={challenge}
      ready={tested}
      readyMessage="Teste um código para liberar as respostas."
      selectedAnswer={answer}
      hintVisible={hintVisible}
      feedback={feedback}
      completed={completed}
      confirmLabel="Enviar Resposta"
      formatAnswer={formatAnswer}
      onSelect={(value) => { setAnswer(value); setFeedback(''); }}
      onHint={() => setHintVisible(true)}
      onConfirm={confirmAnswer}
    />

    {(completed || wrongAttempts >= 2) && <section className="vault-solution" aria-labelledby="vault-solution-heading">
      <h2 id="vault-solution-heading">Conte os dois casos</h2>
      <div className="vault-cases">
        <div><h3>Último algarismo: 0</h3><p>O primeiro tem 9 opções e o do meio tem 8.</p>
          <strong>1 × 9 × 8 = {vaultEndingInZero}</strong></div>
        <div><h3>Último algarismo: 2, 4, 6 ou 8</h3><p>O primeiro tem 8 opções e o do meio tem 8.</p>
          <strong>4 × 8 × 8 = {vaultEndingInOtherEven}</strong></div>
      </div>
      <p>Os casos somam {vaultDigitCombinations} trios. Cada trio combina com as cinco letras.</p>
      {completed && <p className="challenge-equation four-terms">5 × {vaultDigitCombinations} = {formatAnswer(challenge.correctAnswer)}</p>}
    </section>}

    {completed && <CompletionActions
      nextHref={nextChallenge ? `#/desafios/${nextChallenge.id}` : '#/conclusao'}
      nextLabel={nextChallenge ? `Continuar para ${nextChallenge.title}` : 'Ver resumo final'}
      onReplay={replay}
    />}
  </>;
}
