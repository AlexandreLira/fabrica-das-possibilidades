import { useEffect, useRef, useState } from 'react';
import { createGameBridge } from './bridge/events';
import { BotPortrait, PixelButton } from '../ui/components';
import { playGreeting } from '../audio/effects';
export function GamePreview() {
  const host = useRef<HTMLDivElement>(null);
  const [bridge] = useState(createGameBridge);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [message, setMessage] = useState('B.O.T. está esperando por você.');
  useEffect(() => {
    let cancelled = false; let destroy: (() => void) | undefined;
    const offReady = bridge.on('scene:ready', () => { clearTimeout(timeout); setStatus('ready'); });
    const offGreet = bridge.on('bot:greeted', ({ message: greeting }) => setMessage(greeting));
    const fail = () => { if (!cancelled) { cancelled = true; clearTimeout(timeout); destroy?.(); destroy = undefined; setStatus('failed'); } };
    const offFailed = bridge.on('scene:failed', fail);
    const timeout = window.setTimeout(fail, 12000);
    void import('./engine').then(({ mountGame }) => {
      if (!cancelled && host.current) destroy = mountGame(host.current, bridge);
    }).catch(fail);
    return () => { cancelled = true; clearTimeout(timeout); offReady(); offGreet(); offFailed(); bridge.clear(); destroy?.(); };
  }, [bridge]);
  return <section className="game-preview" aria-label="Apresentação do B.O.T.">
    <div className="preview-topline"><span className="eyebrow">Seu parceiro de descobertas</span><span aria-hidden="true">✦</span></div>
    <div className="canvas-frame">
      <div ref={host} className="game-host" aria-hidden="true" />
      {status !== 'ready' && <div className="game-fallback"><BotPortrait /></div>}
    </div>
    <p className="preview-message" role="status">{status === 'failed' ? 'A apresentação animada está indisponível.' : status === 'loading' ? 'Preparando a apresentação…' : message}</p>
    <PixelButton className="secondary w-full" disabled={status !== 'ready'} onClick={() => {
      playGreeting(); bridge.emit('bot:greet', { reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches });
    }}>Cumprimentar B.O.T. <span aria-hidden="true">✦</span></PixelButton>
  </section>;
}
