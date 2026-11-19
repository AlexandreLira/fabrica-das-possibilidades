import Phaser from 'phaser';
import type { PigeonholeChallengeDefinition } from '../../content/challenges';
import type { GameBridge } from '../bridge/events';

export class PigeonholeChallengeScene extends Phaser.Scene {
  constructor(
    private readonly bridge: GameBridge,
    private readonly challenge: PigeonholeChallengeDefinition,
  ) { super('pigeonhole-challenge'); }

  create() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grid = this.add.graphics().lineStyle(1, 0x244251, 1);
    for (let x = 0; x <= 320; x += 16) grid.lineBetween(x, 0, x, 190);
    for (let y = 0; y <= 190; y += 16) grid.lineBetween(0, y, 320, y);

    this.add.text(10, 8, 'DEPÓSITO DE POSSIBILIDADES', { fontFamily: 'monospace', fontSize: '8px', color: '#d3e0e2' });
    const remaining = this.add.text(310, 8, `${this.challenge.items} RESTANTES`, { fontFamily: 'monospace', fontSize: '8px', color: '#f4c955' }).setOrigin(1, 0);
    const columns = Math.min(3, this.challenge.boxes);
    const rows = Math.ceil(this.challenge.boxes / columns);
    const boxWidth = this.challenge.boxes <= 3 ? 78 : 82;
    const gap = columns === 3 ? (300 - boxWidth * columns) / (columns - 1) : 18;
    const totalWidth = boxWidth * columns + gap * (columns - 1);
    const startX = (320 - totalWidth) / 2;
    const top = rows === 1 ? 75 : 57;
    const rowGap = rows === 1 ? 0 : 67;
    const boxHeight = rows === 1 ? 89 : 49;
    const boxes: Phaser.GameObjects.Rectangle[] = [];
    const counts: Phaser.GameObjects.Text[] = [];
    for (let index = 0; index < this.challenge.boxes; index += 1) {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = startX + column * (boxWidth + gap);
      const y = top + row * rowGap;
      const label = this.challenge.boxNames?.[index] ?? `${this.challenge.boxLabel} ${index + 1}`;
      boxes.push(this.add.rectangle(x + boxWidth / 2, y + boxHeight / 2, boxWidth, boxHeight, 0x5b482e).setStrokeStyle(3, 0x8c6b3d));
      this.add.text(x + boxWidth / 2, y - 11, label.toLocaleUpperCase('pt-BR').slice(0, 15), { fontFamily: 'monospace', fontSize: '7px', color: '#fff1c7' }).setOrigin(0.5);
      counts.push(this.add.text(x + boxWidth / 2, y + boxHeight / 2, '0', { fontFamily: 'monospace', fontSize: rows === 1 ? '26px' : '18px', color: '#f4c955' }).setOrigin(0.5));
    }

    const setDistribution = (values: readonly number[], valueRemaining: number) => {
      values.forEach((value, index) => counts[index]?.setText(String(value)));
      remaining.setText(`${valueRemaining} RESTANTES`);
    };
    const offItem = this.bridge.on('challenge:item-placed', ({ boxIndex, counts: values, remaining: valueRemaining }) => {
      setDistribution(values, valueRemaining);
      const box = boxes[boxIndex];
      const count = counts[boxIndex];
      if (box && count && !reducedMotion) this.tweens.add({ targets: [box, count], scale: 1.06, duration: 90, yoyo: true, ease: 'Stepped', easeParams: [2] });
    });
    const offReset = this.bridge.on('challenge:distribution-reset', ({ items }) => {
      setDistribution(Array.from({ length: this.challenge.boxes }, () => 0), items);
      boxes.forEach((box) => box.setStrokeStyle(3, 0x8c6b3d));
    });
    const offAnswer = this.bridge.on('challenge:answer-evaluated', ({ correct }) => {
      if (!correct && !reducedMotion) this.cameras.main.flash(140, 176, 58, 58);
      if (correct) boxes.forEach((box) => box.setStrokeStyle(3, 0x71dfda));
    });
    const offCompleted = this.bridge.on('challenge:completed', () => {
      boxes.forEach((box) => box.setStrokeStyle(3, 0x71dfda));
      this.add.text(160, rows === 1 ? 174 : 184, `GARANTIA: ${this.challenge.correctAnswer}+`, { fontFamily: 'monospace', fontSize: '9px', color: '#71dfda' }).setOrigin(0.5);
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { offItem(); offReset(); offAnswer(); offCompleted(); });
    this.bridge.emit('scene:ready', undefined);
  }
}
