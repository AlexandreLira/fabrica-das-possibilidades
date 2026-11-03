import { appStore } from '../state/store';

export type FeedbackKind = 'reveal' | 'select' | 'place' | 'error' | 'success' | 'complete';

interface AudioOscillator {
  type: string;
  frequency: { setValueAtTime: (value: number, time: number) => void };
  connect: (destination: unknown) => unknown;
  disconnect: () => void;
  start: () => void;
  stop: (time?: number) => void;
  onended: (() => void) | null;
}

interface AudioGain {
  gain: {
    setValueAtTime: (value: number, time: number) => void;
    exponentialRampToValueAtTime: (value: number, time: number) => void;
  };
  connect: (destination: unknown) => unknown;
  disconnect: () => void;
}

export interface AudioRuntime {
  currentTime: number;
  destination: unknown;
  resume: () => Promise<void>;
  createOscillator: () => AudioOscillator;
  createGain: () => AudioGain;
}

const notes: Readonly<Record<FeedbackKind, readonly [number, number]>> = {
  reveal: [330, 440],
  select: [392, 494],
  place: [262, 330],
  error: [220, 165],
  success: [440, 660],
  complete: [523, 784],
};

export function createFeedbackPlayer(
  soundEnabled: () => boolean,
  createRuntime: () => AudioRuntime,
) {
  let runtime: AudioRuntime | undefined;
  let generation = 0;
  const active = new Set<AudioOscillator>();

  const stopActive = () => {
    active.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* The oscillator may already have ended. */ }
    });
    active.clear();
  };

  return {
    play(kind: FeedbackKind): void {
      if (!soundEnabled()) return;
      stopActive();
      const request = ++generation;
      try {
        runtime ??= createRuntime();
        const audio = runtime;
        void audio.resume().then(() => {
          if (!soundEnabled() || request !== generation) return;
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          const [first, second] = notes[kind];
          const duration = kind === 'complete' ? 0.25 : 0.17;
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(first, audio.currentTime);
          oscillator.frequency.setValueAtTime(second, audio.currentTime + 0.08);
          gain.gain.setValueAtTime(0.025, audio.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration - 0.01);
          oscillator.connect(gain);
          gain.connect(audio.destination);
          active.add(oscillator);
          oscillator.onended = () => {
            active.delete(oscillator);
            oscillator.disconnect();
            gain.disconnect();
          };
          oscillator.start();
          oscillator.stop(audio.currentTime + duration);
        }).catch(() => { /* Privacy settings may reject audio resume. */ });
      } catch { /* Visual feedback remains available when audio is unavailable. */ }
    },
    stopAll(): void {
      generation += 1;
      stopActive();
    },
  };
}

const player = createFeedbackPlayer(
  () => appStore.getState().soundEnabled,
  () => new AudioContext() as unknown as AudioRuntime,
);

appStore.subscribe(({ soundEnabled }) => {
  if (!soundEnabled) player.stopAll();
});

/** Call only from a user gesture; blocked/unavailable audio must never break navigation. */
export function playGreeting(): void {
  player.play('success');
}

export function playFeedback(kind: FeedbackKind): void {
  player.play(kind);
}
