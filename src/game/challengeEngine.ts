import Phaser from 'phaser';
import type { GameBridge } from './bridge/events';
import { AdditionChallengeScene } from './scenes/AdditionChallengeScene';
import { MultiplicationChallengeScene } from './scenes/MultiplicationChallengeScene';
import { PigeonholeChallengeScene } from './scenes/PigeonholeChallengeScene';
import type { AnyChallengeDefinition, CriticalStorageChallengeDefinition, VaultChallengeDefinition } from '../content/challenges';

export function mountChallengeGame(parent: HTMLElement, bridge: GameBridge, challenge: Exclude<AnyChallengeDefinition, VaultChallengeDefinition | CriticalStorageChallengeDefinition>): () => void {
  const scene = challenge.principle === 'addition'
    ? new AdditionChallengeScene(bridge, challenge.groups)
    : challenge.principle === 'multiplication'
      ? new MultiplicationChallengeScene(bridge, challenge)
      : new PigeonholeChallengeScene(bridge, challenge);
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
