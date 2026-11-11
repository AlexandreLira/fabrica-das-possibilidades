import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { appStore } from '../state/store';
import { useRoute } from './navigation';
import { Home } from '../screens/Home';
import { Instructions } from '../screens/Instructions';
import { Sectors } from '../screens/Sectors';
import { AdditionChallenge } from '../screens/AdditionChallenge';
import { MultiplicationChallenge } from '../screens/MultiplicationChallenge';
import { PigeonholeChallenge } from '../screens/PigeonholeChallenge';
import { Completion } from '../screens/Completion';
import { ChallengeUnavailable } from '../screens/ChallengeUnavailable';
import { UpdateNotice } from './UpdateNotice';
import type { ChallengeId } from '../content/sectors';
export function App() {
  const route = useRoute(); const previousRoute = useRef<typeof route | null>(null);
  const sound = useStore(appStore, (state) => state.soundEnabled);
  const toggle = useStore(appStore, (state) => state.toggleSound);
  useEffect(() => {
    if (previousRoute.current !== route) {
      document.querySelector<HTMLHeadingElement>('h1')?.focus(); window.scrollTo(0, 0); previousRoute.current = route;
    }
  }, [route]);
  return <div className="app-shell">
    <a className="skip-link" href="#main" onClick={(event) => { event.preventDefault(); document.getElementById('main')?.focus(); }}>Pular para o conteúdo</a>
    <header className="app-header"><span className="brand-mark" aria-label="Fábrica das Possibilidades"><span aria-hidden="true">▥</span> F.P<span className="brand-dot">.</span></span>
      <button className="sound-button" onClick={toggle} aria-label={sound ? 'Silenciar efeitos sonoros' : 'Ativar efeitos sonoros'} aria-pressed={sound}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9h4l5-4v14l-5-4H3z" />{sound ? <path d="M16 8q5 4 0 8M19 4q9 8 0 16" /> : <path d="m16 9 6 6m0-6-6 6" />}</svg>
        <span>Som {sound ? 'ligado' : 'desligado'}</span>
      </button>
    </header>
    <main id="main" tabIndex={-1}>{route === 'home' ? <Home />
      : route === 'instructions' ? <Instructions />
        : route === 'sectors' ? <Sectors />
          : route === 'completion' ? <Completion />
            : route.startsWith('challenge:') ? (() => {
              const id = route.slice('challenge:'.length) as ChallengeId;
              return id === 'adicao-1' ? <AdditionChallenge />
                : id === 'multiplicacao-1' ? <MultiplicationChallenge />
                  : id === 'casas-de-pombo-1' ? <PigeonholeChallenge />
                    : <ChallengeUnavailable id={id} />;
            })() : <Home />}</main>
    <footer className="app-footer"><span aria-hidden="true">◆</span> FEITO DE IDEIAS E POSSIBILIDADES <span aria-hidden="true">◆</span></footer>
    {import.meta.env.PROD && <UpdateNotice />}
  </div>;
}
