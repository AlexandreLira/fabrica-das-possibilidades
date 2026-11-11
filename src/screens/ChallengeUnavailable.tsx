import { getSectorForChallenge, type ChallengeId } from '../content/sectors';

export function ChallengeUnavailable({ id }: { id: ChallengeId }) {
  const sector = getSectorForChallenge(id);
  const phase = Number(id.slice(id.lastIndexOf('-') + 1));
  return <section className="page-content unavailable-challenge">
    <a className="back-link" href="#/setores">← Voltar ao mapa</a>
    <span className="eyebrow page-eyebrow">{sector?.title}</span>
    <h1 tabIndex={-1}>Fase em desenvolvimento</h1>
    <p className="page-intro">A fase {phase} deste setor ainda está sendo preparada.</p>
    <a className="pixel-button primary" href="#/setores">Voltar aos setores <span aria-hidden="true">→</span></a>
  </section>;
}
