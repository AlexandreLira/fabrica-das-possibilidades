import { BotBubble, BotPortrait } from '../ui/components';
export function Home() {
  return <>
    <div className="hero-heading">
      <span className="eyebrow hero-eyebrow"><span className="status-dot" /> Matemática em construção</span>
      <h1 tabIndex={-1}>Fábrica das <span>Possibilidades</span></h1>
      <p className="hero-subtitle">Pequenas escolhas.<br />Grandes descobertas.</p>
    </div>
    <div className="factory" aria-hidden="true">
      <div className="factory-label">UNIDADE 01 <span>● ONLINE</span></div>
      <div className="factory-window window-one"><i /><i /><i /><i /></div>
      <div className="factory-window window-two"><i /><i /><i /><i /></div>
      <span className="pipe pipe-left" /><span className="pipe pipe-right" />
      <span className="floating-symbol symbol-plus">+</span><span className="floating-symbol symbol-times">×</span>
      <div className="bot-stage"><BotPortrait /></div>
      <div className="crate crate-left">+</div><div className="crate crate-right">×</div>
      <div className="conveyor"><span /><span /><span /><span /><span /><span /><span /></div>
      <div className="factory-floor" />
    </div>
    <BotBubble>Olá! Eu sou o B.O.T. Vamos descobrir quantas possibilidades cabem em uma ideia?</BotBubble>
    <div className="home-actions flex flex-col gap-3">
      <a href="#/setores" className="pixel-button primary">Começar <span aria-hidden="true">→</span></a>
      <a href="#/instrucoes" className="pixel-button secondary">Como jogar <span aria-hidden="true">?</span></a>
    </div>
    <div className="journey-summary"><span>3 setores</span><span aria-hidden="true">✦</span><span>Um mundo de possibilidades</span></div>
    <p className="foundation-note">A fábrica está ganhando vida. Os desafios chegam na próxima etapa.</p>
  </>;
}
