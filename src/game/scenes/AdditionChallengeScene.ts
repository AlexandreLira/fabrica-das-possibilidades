import Phaser from 'phaser';
import type { AdditionRouteId } from '../../content/challenges';
import type { GameBridge } from '../bridge/events';

export class AdditionChallengeScene extends Phaser.Scene {
  constructor(private readonly bridge: GameBridge) { super('addition-challenge'); }

  create() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grid = this.add.graphics().lineStyle(1, 0x244251, 1);
    for (let x = 0; x <= 320; x += 16) grid.lineBetween(x, 0, x, 190);
    for (let y = 0; y <= 190; y += 16) grid.lineBetween(0, y, 320, y);

    const routeObjects: Record<AdditionRouteId, Array<Phaser.GameObjects.Rectangle | Phaser.GameObjects.Text>> = {
      local: this.createRoute(14, 20, 132, 93, 'LOCAL', 3, 0xf4c955),
      express: this.createRoute(174, 20, 132, 93, 'EXPRESSA', 4, 0x71dfda),
    };
    const conveyor = this.add.rectangle(160, 158, 292, 28, 0x203c49).setStrokeStyle(3, 0x6d8790);
    const parcel = this.add.rectangle(34, 158, 18, 18, 0xd7a753).setStrokeStyle(2, 0xffe2a0);
    for (let x = 58; x < 294; x += 30) this.add.circle(x, 158, 4, 0x89a3a4);

    const offRoute = this.bridge.on('challenge:route-revealed', ({ routeId }) => {
      routeObjects[routeId].forEach((object) => object.setAlpha(1));
      if (!reducedMotion) this.tweens.add({ targets: routeObjects[routeId], scale: 1.05, duration: 100, yoyo: true, ease: 'Stepped', easeParams: [2] });
    });
    const offAnswer = this.bridge.on('challenge:answer-evaluated', ({ correct }) => {
      if (!correct && !reducedMotion) this.cameras.main.flash(140, 176, 58, 58);
      if (correct) conveyor.setFillStyle(0x285b58);
    });
    const offCompleted = this.bridge.on('challenge:completed', () => {
      conveyor.setFillStyle(0x285b58);
      parcel.setFillStyle(0xf4c955);
      if (reducedMotion) parcel.setX(286);
      else this.tweens.add({ targets: parcel, x: 286, duration: 800, ease: 'Stepped', easeParams: [12] });
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { offRoute(); offAnswer(); offCompleted(); });
    this.bridge.emit('scene:ready', undefined);
  }

  private createRoute(x: number, y: number, width: number, height: number, label: string, count: number, color: number) {
    const objects: Array<Phaser.GameObjects.Rectangle | Phaser.GameObjects.Text> = [];
    objects.push(this.add.rectangle(x + width / 2, y + height / 2, width, height, 0x193744).setStrokeStyle(2, color));
    objects.push(this.add.text(x + 8, y + 8, label, { fontFamily: 'monospace', fontSize: '10px', color: '#f7f2e5' }));
    for (let index = 0; index < count; index += 1) {
      const vehicle = this.add.rectangle(x + 25 + (index % 2) * 57, y + 42 + Math.floor(index / 2) * 28, 38, 17, color).setStrokeStyle(2, 0x112938);
      objects.push(vehicle);
    }
    objects.forEach((object) => object.setAlpha(0.28));
    return objects;
  }
}
