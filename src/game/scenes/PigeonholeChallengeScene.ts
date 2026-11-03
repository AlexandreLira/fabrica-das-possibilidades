import Phaser from 'phaser';
import type { GameBridge } from '../bridge/events';

export class PigeonholeChallengeScene extends Phaser.Scene {
  constructor(private readonly bridge: GameBridge) { super('pigeonhole-challenge'); }

  create() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grid = this.add.graphics().lineStyle(1, 0x244251, 1);
    for (let x = 0; x <= 320; x += 16) grid.lineBetween(x, 0, x, 190);
    for (let y = 0; y <= 190; y += 16) grid.lineBetween(0, y, 320, y);

    this.add.text(12, 10, 'DEPÓSITO', { fontFamily: 'monospace', fontSize: '10px', color: '#d3e0e2' });
    const remaining = this.add.text(308, 10, '7 RESTANTES', { fontFamily: 'monospace', fontSize: '9px', color: '#f4c955' }).setOrigin(1, 0);
    const boxes: Phaser.GameObjects.Rectangle[] = [];
    const counts: Phaser.GameObjects.Text[] = [];
    for (let index = 0; index < 3; index += 1) {
      const x = 61 + index * 99;
      boxes.push(this.add.rectangle(x, 105, 78, 91, 0x5b482e).setStrokeStyle(3, 0x8c6b3d));
      this.add.text(x, 69, `CAIXA ${index + 1}`, { fontFamily: 'monospace', fontSize: '8px', color: '#fff1c7' }).setOrigin(0.5);
      counts.push(this.add.text(x, 107, '0', { fontFamily: 'monospace', fontSize: '26px', color: '#f4c955' }).setOrigin(0.5));
    }

    const setDistribution = (values: readonly [number, number, number], valueRemaining: number) => {
      values.forEach((value, index) => counts[index]?.setText(String(value)));
      remaining.setText(`${valueRemaining} RESTANTES`);
    };
    const offItem = this.bridge.on('challenge:item-placed', ({ boxIndex, counts: values, remaining: valueRemaining }) => {
      setDistribution(values, valueRemaining);
      if (!reducedMotion) this.tweens.add({ targets: [boxes[boxIndex], counts[boxIndex]], scale: 1.06, duration: 90, yoyo: true, ease: 'Stepped', easeParams: [2] });
    });
    const offReset = this.bridge.on('challenge:distribution-reset', () => setDistribution([0, 0, 0], 7));
    const offAnswer = this.bridge.on('challenge:answer-evaluated', ({ correct }) => {
      if (!correct && !reducedMotion) this.cameras.main.flash(140, 176, 58, 58);
      if (correct) boxes.forEach((box) => box.setStrokeStyle(3, 0x71dfda));
    });
    const offCompleted = this.bridge.on('challenge:completed', () => {
      boxes.forEach((box) => box.setStrokeStyle(3, 0x71dfda));
      this.add.text(160, 168, 'GARANTIA: 3  •  LIMITE: 3–2–2', { fontFamily: 'monospace', fontSize: '9px', color: '#71dfda' }).setOrigin(0.5);
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { offItem(); offReset(); offAnswer(); offCompleted(); });
    this.bridge.emit('scene:ready', undefined);
  }
}
