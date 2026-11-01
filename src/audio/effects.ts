import { appStore } from '../state/store';
let context: AudioContext | undefined;
const active = new Set<OscillatorNode>();
appStore.subscribe(({ soundEnabled }) => {
  if (!soundEnabled) { active.forEach((oscillator) => { try { oscillator.stop(); } catch { /* Already stopped. */ } }); active.clear(); }
});
/** Call only from a user gesture; blocked/unavailable audio must never break navigation. */
export function playGreeting(): void {
  playFeedback('success');
}

export function playFeedback(kind: 'reveal' | 'success' | 'error'): void {
  if (!appStore.getState().soundEnabled) return;
  try {
    context ??= new AudioContext();
    const audio = context;
    void audio.resume().then(() => {
      if (!appStore.getState().soundEnabled) return;
      const oscillator = audio.createOscillator(); const gain = audio.createGain();
      const frequencies: readonly [number, number] = kind === 'success' ? [440, 660] : kind === 'error' ? [220, 165] : [330, 440];
      oscillator.type = 'square'; oscillator.frequency.setValueAtTime(frequencies[0], audio.currentTime);
      oscillator.frequency.setValueAtTime(frequencies[1], audio.currentTime + 0.08);
      gain.gain.setValueAtTime(0.025, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.16);
      oscillator.connect(gain); gain.connect(audio.destination); active.add(oscillator);
      oscillator.onended = () => { active.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
      oscillator.start(); oscillator.stop(audio.currentTime + 0.17);
    }).catch(() => { /* Audio can be unavailable in browser privacy modes. */ });
  } catch { /* Visual feedback remains available. */ }
}
