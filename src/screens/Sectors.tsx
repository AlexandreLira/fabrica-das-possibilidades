import { useStore } from 'zustand';
import { demoChallenges } from '../content/challenges';
import { sectors } from '../content/sectors';
import { GamePreview } from '../game/GamePreview';
import { appStore } from '../state/store';
import { Panel } from '../ui/components';
export function Sectors() {
  const completedChallengeIds = useStore(appStore, (state) => state.completedChallengeIds);
  const challengeNames = { addition: 'Adição', multiplication: 'Multiplicação', pigeonhole: 'Casas de Pombo' } as const;
  return <>
    <a className="back-link" href="#/">← Voltar ao início</a>
    <span className="eyebrow page-eyebrow">Mapa da fábrica</span>
    <h1 tabIndex={-1}>Conheça os setores</h1>
    <p className="page-intro">Três maneiras de enxergar as possibilidades. Sua jornada começa aqui.</p>
    <div className="sector-list flex flex-col gap-4">
      {sectors.map((sector) => {
        const challenge = demoChallenges.find((item) => item.principle === sector.id)!;
        const completed = completedChallengeIds.includes(challenge.id);
        return <Panel key={sector.id} className={`sector sector-${sector.id}`}>
        <div className="sector-top"><span className="sector-symbol" aria-hidden="true">{sector.symbol}</span><div><span className="eyebrow">Setor {sector.number}</span><p className="sector-name">{sector.name}</p></div></div>
        <h2>{sector.title}</h2><p>{sector.description}</p>
        {completed && <span className="sector-complete"><span aria-hidden="true">✓</span> Concluída nesta sessão</span>}
        <a
          className="pixel-button primary sector-play"
          href={`#/desafios/${challenge.id}`}
          aria-label={completed ? `Jogar novamente a fase de ${challengeNames[sector.id]}` : `Jogar fase de ${challengeNames[sector.id]}`}
        >{completed ? 'Jogar novamente' : 'Jogar fase'} <span aria-hidden="true">→</span></a>
      </Panel>;
      })}
    </div>
    <GamePreview />
  </>;
}
