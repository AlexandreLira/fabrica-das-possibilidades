import { useStore } from 'zustand';
import { appStore } from '../state/store';
import { BotBubble, PixelButton } from '../ui/components';
export function Instructions() {
  const complete = useStore(appStore, (state) => state.completeInstructions);
  return <>
    <a className="back-link" href="#/">← Voltar ao início</a>
    <span className="eyebrow page-eyebrow">Manual de boas-vindas</span>
    <h1 tabIndex={-1}>Uma ideia de cada vez.</h1>
    <p className="page-intro">Ajude B.O.T. a colocar os três setores da fábrica em funcionamento.</p>
    <ol className="instruction-list">
      <li><span className="step-number">01</span><div><h2>Conheça a fábrica</h2><p>Visite os três setores e descubra o que cada princípio ajuda a contar.</p></div></li>
      <li><span className="step-number">02</span><div><h2>Explore e responda</h2><p>Use os botões para investigar cada situação, selecione uma resposta e confirme. Não é preciso arrastar objetos.</p></div></li>
      <li><span className="step-number">03</span><div><h2>Peça ajuda quando precisar</h2><p>Você pode rever o tutorial, abrir uma dica e tentar novamente depois de errar.</p></div></li>
      <li><span className="step-number">04</span><div><h2>Escolha como jogar</h2><p>Os efeitos acompanham suas ações e podem ser silenciados a qualquer momento no topo da tela.</p></div></li>
    </ol>
    <BotBubble>Os três setores estão prontos para a demonstração. Você pode começar por qualquer um deles!</BotBubble>
    <PixelButton className="primary w-full mt-6" onClick={() => { complete(); window.location.hash = '/setores'; }}>Entendi, vamos lá <span aria-hidden="true">→</span></PixelButton>
  </>;
}
