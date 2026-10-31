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
    const bot = this.add.image(160, 79, 'bot').setScale(2);
    const off = this.bridge.on('bot:greet', ({ reducedMotion }) => {
      this.tweens.killTweensOf(bot); bot.setY(79);
      if (!reducedMotion) this.tweens.add({ targets: bot, y: 70, duration: 130, yoyo: true, repeat: 1, ease: 'Stepped', easeParams: [3] });
      this.bridge.emit('bot:greeted', { message: 'Tudo pronto por aqui! Vamos explorar as possibilidades?' });
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, off);
    this.bridge.emit('scene:ready', undefined);
  }
}
