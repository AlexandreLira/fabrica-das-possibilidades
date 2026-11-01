import { sectors } from '../content/sectors';
import { GamePreview } from '../game/GamePreview';
import { Panel } from '../ui/components';
export function Sectors() {
  return <>
    <a className="back-link" href="#/">← Voltar ao início</a>
    <span className="eyebrow page-eyebrow">Mapa da fábrica</span>
    <h1 tabIndex={-1}>Conheça os setores</h1>
    <p className="page-intro">Três maneiras de enxergar as possibilidades. Sua jornada começa aqui.</p>
    <div className="sector-list flex flex-col gap-4">
      {sectors.map((sector) => <Panel key={sector.id} className={`sector sector-${sector.id}`}>
        <div className="sector-top"><span className="sector-symbol" aria-hidden="true">{sector.symbol}</span><div><span className="eyebrow">Setor {sector.number}</span><p className="sector-name">{sector.name}</p></div></div>
        <h2>{sector.title}</h2><p>{sector.description}</p>
        {sector.id === 'addition'
          ? <a className="pixel-button primary sector-play" href="#/desafios/adicao-1">Jogar fase teste <span aria-hidden="true">→</span></a>
          : <span className="coming-soon"><span aria-hidden="true">▧</span> Desafios em preparação</span>}
      </Panel>)}
    </div>
    <GamePreview />
  </>;
}
