import { useStore } from 'zustand';
import { appStore } from '../state/store';
import { BotBubble, Panel } from '../ui/components';

export function Completion() {
  const complete = useStore(appStore, (state) => state.allDemoChallengesCompleted);
  return <>
    <a className="back-link" href="#/setores">← Voltar ao mapa</a>
    <span className="eyebrow page-eyebrow">Resumo da demonstração</span>
    <h1 tabIndex={-1}>{complete ? 'Fábrica em funcionamento!' : 'Resumo dos princípios'}</h1>
    <BotBubble>{complete
      ? 'Você concluiu todas as fases disponíveis nesta demonstração! Agora já consegue reconhecer três maneiras diferentes de contar possibilidades.'
      : 'Você pode consultar este painel e voltar ao mapa para experimentar as fases disponíveis.'}</BotBubble>
    <div className="principle-summary">
      <Panel><span aria-hidden="true">+</span><h2>Princípio da Adição</h2><p><strong>OU entre grupos distintos:</strong> somamos as quantidades de alternativas.</p></Panel>
      <Panel><span aria-hidden="true">×</span><h2>Princípio da Multiplicação</h2><p><strong>E entre etapas independentes:</strong> multiplicamos as escolhas de cada etapa.</p></Panel>
      <Panel><span aria-hidden="true">▦</span><h2>Casas de Pombo</h2><p>Ao distribuir objetos, encontramos uma <strong>ocupação mínima garantida</strong> em alguma caixa.</p></Panel>
    </div>
    <a className="pixel-button primary w-full" href="#/setores">Voltar aos setores <span aria-hidden="true">→</span></a>
  </>;
}
