import { describe, expect, it, vi } from 'vitest';
import { createFeedbackPlayer, type AudioRuntime } from './effects';

function fakeAudio() {
  const oscillators: Array<{ stop: ReturnType<typeof vi.fn>; onended: (() => void) | null }> = [];
  const runtime: AudioRuntime = {
    currentTime: 1,
    resume: vi.fn().mockResolvedValue(undefined),
    createOscillator: () => {
      const oscillator = {
        type: 'sine',
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        onended: null as (() => void) | null,
      };
      oscillators.push(oscillator);
      return oscillator;
    },
    createGain: () => ({
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
      disconnect: vi.fn(),
    }),
    destination: {},
  };
  return { runtime, oscillators };
}

describe('efeitos sonoros', () => {
  it('não cria contexto enquanto o som está desligado', () => {
    const createRuntime = vi.fn();
    const player = createFeedbackPlayer(() => false, createRuntime);
    player.play('select');
    expect(createRuntime).not.toHaveBeenCalled();
  });

  it('aceita os seis efeitos e reutiliza o contexto', async () => {
    const { runtime, oscillators } = fakeAudio();
    const createRuntime = vi.fn(() => runtime);
    const player = createFeedbackPlayer(() => true, createRuntime);
    for (const kind of ['reveal', 'select', 'place', 'error', 'success', 'complete'] as const) {
      player.play(kind);
      await Promise.resolve();
    }
    expect(createRuntime).toHaveBeenCalledTimes(1);
    expect(oscillators).toHaveLength(6);
  });

  it('interrompe o efeito anterior e todos os ativos ao silenciar', async () => {
    const { runtime, oscillators } = fakeAudio();
    const player = createFeedbackPlayer(() => true, () => runtime);
    player.play('reveal');
    await Promise.resolve();
    player.play('place');
    await Promise.resolve();
    expect(oscillators[0]!.stop).toHaveBeenCalled();
    player.stopAll();
    expect(oscillators[1]!.stop).toHaveBeenCalled();
  });

  it('ignora indisponibilidade do contexto sem lançar erro', () => {
    const player = createFeedbackPlayer(() => true, () => { throw new Error('audio bloqueado'); });
    expect(() => player.play('complete')).not.toThrow();
  });
});
