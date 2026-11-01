import Phaser from 'phaser';
import type { GameBridge } from './bridge/events';
import { AdditionChallengeScene } from './scenes/AdditionChallengeScene';

export function mountChallengeGame(parent: HTMLElement, bridge: GameBridge): () => void {
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
    scene: new AdditionChallengeScene(bridge),
    audio: { noAudio: true },
  });
  return () => { game.destroy(true); };
}
