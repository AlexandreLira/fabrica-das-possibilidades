import Phaser from 'phaser';
import type { GameBridge } from './bridge/events';
import { AdditionChallengeScene } from './scenes/AdditionChallengeScene';
import { MultiplicationChallengeScene } from './scenes/MultiplicationChallengeScene';
import { PigeonholeChallengeScene } from './scenes/PigeonholeChallengeScene';
import type { Principle } from '../content/sectors';

export function mountChallengeGame(parent: HTMLElement, bridge: GameBridge, kind: Principle): () => void {
  const scene = kind === 'addition'
    ? new AdditionChallengeScene(bridge)
    : kind === 'multiplication'
      ? new MultiplicationChallengeScene(bridge)
      : new PigeonholeChallengeScene(bridge);
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 320,
    height: 190,
    backgroundColor: '#112938',
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    banner: false,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene,
    audio: { noAudio: true },
  });
  return () => { game.destroy(true); };
}
