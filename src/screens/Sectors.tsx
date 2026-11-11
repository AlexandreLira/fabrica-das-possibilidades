import { useStore } from 'zustand';
import { demoChallenges } from '../content/challenges';
import { sectors } from '../content/sectors';
import { GamePreview } from '../game/GamePreview';
import { appStore } from '../state/store';
import { Panel } from '../ui/components';
export function Sectors() {
  const completedChallengeIds = useStore(appStore, (state) => state.completedChallengeIds);
  const sectorLabels = { addition: 'Adição', multiplication: 'Multiplicação', pigeonhole: 'Casas de Pombo' } as const;
  return <>
    <a className="back-link" href="#/">← Voltar ao início</a>
    <span className="eyebrow page-eyebrow">Mapa da fábrica</span>
    <h1 tabIndex={-1}>Conheça os setores</h1>
    <p className="page-intro">Três maneiras de enxergar as possibilidades. Sua jornada começa aqui.</p>
    <div className="sector-list flex flex-col gap-4">
      {sectors.map((sector) => {
        return <Panel key={sector.id} className={`sector sector-${sector.id}`}>
        <div className="sector-top"><span className="sector-symbol" aria-hidden="true">{sector.symbol}</span><div><span className="eyebrow">Setor {sector.number}</span><p className="sector-name">{sector.name}</p></div></div>
        <h2>{sector.title}</h2><p>{sector.description}</p>
        <ol className="sector-phases" aria-label={`Fases de ${sector.title}`}>
          {sector.challengeIds.map((id, index) => {
            const completed = completedChallengeIds.includes(id);
            const available = demoChallenges.some((challenge) => challenge.id === id);
            const phaseLabel = `Fase ${index + 1} de ${sectorLabels[sector.id]}`;
            return <li className="sector-phase" key={id}>
              <span className="sector-phase-number" aria-hidden="true">{completed ? '✓' : String(index + 1).padStart(2, '0')}</span>
              <span className="sector-phase-status">{available ? (completed ? 'Concluída nesta sessão' : 'Disponível') : 'Em desenvolvimento'}</span>
              {available
                ? <a className="sector-phase-action" href={`#/desafios/${id}`} aria-label={completed ? `Jogar novamente a fase de ${sectorLabels[sector.id]}` : `Jogar fase de ${sectorLabels[sector.id]}`}>{completed ? 'Jogar novamente' : 'Jogar fase'} <span aria-hidden="true">→</span></a>
                : <button className="sector-phase-action" type="button" disabled aria-label={`${phaseLabel} — em desenvolvimento`}>Em breve</button>}
            </li>;
          })}
        </ol>
      </Panel>;
      })}
    </div>
    <GamePreview />
  </>;
}
