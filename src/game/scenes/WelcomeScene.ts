import Phaser from 'phaser';
import type { GameBridge } from '../bridge/events';
import botUrl from '../../assets/bot.svg?no-inline';
export class WelcomeScene extends Phaser.Scene {
  constructor(private readonly bridge: GameBridge) { super('welcome'); }
  preload() { this.load.svg('bot', botUrl, { width: 48, height: 56 }); }
  create() {
    if (!this.textures.exists('bot')) {
      this.bridge.emit('scene:failed', undefined);
      return;
    }
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x244251, 1);
    for (let x = 0; x <= 320; x += 16) grid.lineBetween(x, 0, x, 160);
    for (let y = 0; y <= 160; y += 16) grid.lineBetween(0, y, 320, y);
    grid.fillStyle(0x314f5c).fillRect(0, 136, 320, 24);
    grid.fillStyle(0x71dfda).fillRect(112, 134, 96, 2);
    const body = this.add.image(0, 0, 'bot').setScale(2);
    const createArm = (x: number, direction: 1 | -1) => {
      const upper = this.add.rectangle(0, 8, 7, 18, 0x966e32);
      const forearm = this.add.rectangle(0, 18, 6, 15, 0xf4c955);
      const hand = this.add.rectangle(0, 28, 10, 9, 0xffe7a0);
      return this.add.container(x, 23, [upper, forearm, hand]).setAngle(direction * 15).setVisible(false);
    };
    const rightArm = createArm(22, -1);
    const leftArm = createArm(-22, 1);
    const bot = this.add.container(160, 79, [leftArm, rightArm, body]);
    const reset = () => {
      bot.setPosition(160, 79).setAngle(0);
      rightArm.setAngle(-15).setVisible(false);
      leftArm.setAngle(15).setVisible(false);
    };

    const off = this.bridge.on('bot:act', ({ action, reducedMotion }) => {
      this.tweens.killTweensOf([bot, rightArm, leftArm]);
      reset();
      if (action === 'wave') {
        rightArm.setVisible(true).setAngle(-145);
        if (!reducedMotion) this.tweens.add({
          targets: rightArm, angle: -105, duration: 155, yoyo: true, repeat: 2,
          ease: 'Stepped', easeParams: [4], onComplete: reset,
        });
      } else if (action === 'dance') {
        leftArm.setVisible(true).setAngle(70);
        rightArm.setVisible(true).setAngle(-135);
        bot.setAngle(-10);
        if (!reducedMotion) {
          this.tweens.add({
            targets: bot, x: { from: 135, to: 185 }, angle: 10, y: 71,
            duration: 235, yoyo: true, repeat: 3, ease: 'Sine.easeInOut', onComplete: reset,
          });
          this.tweens.add({ targets: leftArm, angle: 135, duration: 235, yoyo: true, repeat: 3 });
          this.tweens.add({ targets: rightArm, angle: -70, duration: 235, yoyo: true, repeat: 3 });
        }
      } else if (!reducedMotion) {
        this.tweens.add({ targets: bot, y: 74, duration: 120, yoyo: true, onComplete: reset });
      }
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, off);
    this.bridge.emit('scene:ready', undefined);
  }
}
