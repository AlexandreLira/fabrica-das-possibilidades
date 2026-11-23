import { useEffect, useRef, useState } from 'react';
import { createGameBridge, type BotAction } from './bridge/events';
import { BotPortrait, PixelButton } from '../ui/components';
import { playGreeting } from '../audio/effects';
const botLines: Record<BotAction, readonly string[]> = {
  wave: ['Tudo pronto por aqui! Vamos explorar as possibilidades?', 'Olá de novo! Que tal visitar outro setor da fábrica?'],
  talk: [
    'Se você pode escolher uma opção de um grupo ou de outro, confira se há opções repetidas antes de somar.',
    'Uma escolha de cada tipo de peça? Conte quantas opções você tem em cada etapa da montagem.',
    'As peças podem se espalhar por todas as caixas. Pense no pior cenário para descobrir o que sempre acontece.',
    'Uma resposta errada também dá pistas. Leia o retorno e experimente outra ideia!',
  ],
  dance: ['Hora da dança da fábrica! Um passo pra cá, outro pra lá!', 'Dois passos e um pulinho. B.O.T. em ritmo de produção!'],
};

export function GamePreview() {
  const lineIndex = useRef({ wave: 0, talk: 0, dance: 0 });
  const host = useRef<HTMLDivElement>(null);
  const [bridge] = useState(createGameBridge);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [message, setMessage] = useState('B.O.T. está esperando por você.');
  useEffect(() => {
    let cancelled = false; let destroy: (() => void) | undefined;
    const offReady = bridge.on('scene:ready', () => { clearTimeout(timeout); setStatus('ready'); });
    const fail = () => { if (!cancelled) { cancelled = true; clearTimeout(timeout); destroy?.(); destroy = undefined; setStatus('failed'); } };
    const offFailed = bridge.on('scene:failed', fail);
    const timeout = window.setTimeout(fail, 12000);
    void import('./engine').then(({ mountGame }) => {
      if (!cancelled && host.current) destroy = mountGame(host.current, bridge);
    }).catch(fail);
    return () => { cancelled = true; clearTimeout(timeout); offReady(); offFailed(); bridge.clear(); destroy?.(); };
  }, [bridge]);
  const act = (action: BotAction) => {
    const lines = botLines[action];
    setMessage(lines[lineIndex.current[action] % lines.length] ?? '');
    lineIndex.current[action] += 1;
    playGreeting();
    bridge.emit('bot:act', { action, reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches });
  };

  return <section className="game-preview" aria-label="Apresentação do B.O.T.">
    <div className="preview-topline"><span className="eyebrow">Seu parceiro de descobertas</span><span aria-hidden="true">✦</span></div>
    <div className="canvas-frame">
      <div ref={host} className="game-host" aria-hidden="true" />
      {status !== 'ready' && <div className="game-fallback"><BotPortrait /></div>}
    </div>
    <p className="preview-message" role="status">{status === 'failed' ? 'A apresentação animada está indisponível.' : status === 'loading' ? 'Preparando a apresentação…' : message}</p>
    <div className="bot-actions">
      <PixelButton className="secondary" disabled={status !== 'ready'} onClick={() => act('wave')}>Cumprimentar B.O.T.</PixelButton>
      <PixelButton className="secondary" disabled={status !== 'ready'} onClick={() => act('talk')}>Conversar</PixelButton>
      <PixelButton className="secondary" disabled={status !== 'ready'} onClick={() => act('dance')}>Dançar</PixelButton>
    </div>
  </section>;
}
