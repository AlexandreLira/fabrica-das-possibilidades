import { useStore } from 'zustand';
import { appStore } from '../state/store';
import { BotBubble, PixelButton } from '../ui/components';
export function Instructions() {
  const complete = useStore(appStore, (state) => state.completeInstructions);
  return <>
    <a className="back-link" href="#/">← Voltar ao início</a>
    <span className="eyebrow page-eyebrow">Manual de boas-vindas</span>
    <h1 tabIndex={-1}>Uma ideia de cada vez.</h1>
    <p className="page-intro">Você e B.O.T. vão explorar a matemática por trás das escolhas da fábrica.</p>
    <ol className="instruction-list">
      <li><span className="step-number">01</span><div><h2>Conheça a fábrica</h2><p>Visite os três setores e descubra o que cada princípio ajuda a contar.</p></div></li>
      <li><span className="step-number">02</span><div><h2>Explore no seu ritmo</h2><p>Use os botões para navegar. Não é preciso arrastar objetos ou girar o celular.</p></div></li>
      <li><span className="step-number">03</span><div><h2>Dê um oi ao B.O.T.</h2><p>Na apresentação dos setores, toque em “Cumprimentar B.O.T.”. Você pode desligar o som a qualquer momento.</p></div></li>
    </ol>
    <BotBubble>Esta é a nossa primeira visita! As missões, dicas e pontuação ainda estão em preparação.</BotBubble>
    <PixelButton className="primary w-full mt-6" onClick={() => { complete(); window.location.hash = '/setores'; }}>Entendi, vamos lá <span aria-hidden="true">→</span></PixelButton>
  </>;
}
