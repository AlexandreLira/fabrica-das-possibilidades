import Phaser from 'phaser';
import type { AdditionChallengeDefinition } from '../../content/challenges';
import type { GameBridge } from '../bridge/events';

export class AdditionChallengeScene extends Phaser.Scene {
  constructor(
    private readonly bridge: GameBridge,
    private readonly groups: AdditionChallengeDefinition['groups'],
  ) { super('addition-challenge'); }

  create() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grid = this.add.graphics().lineStyle(1, 0x244251, 1);
    for (let x = 0; x <= 320; x += 16) grid.lineBetween(x, 0, x, 190);
    for (let y = 0; y <= 190; y += 16) grid.lineBetween(0, y, 320, y);

    const colors = [0xf4c955, 0x71dfda, 0xef7d72, 0xa8b4f9];
    const staffLayout = this.groups.length === 4;
    const width = staffLayout ? 142 : this.groups.length === 2 ? 132 : 96;
    const gap = this.groups.length === 2 ? 28 : 8;
    const columns = staffLayout ? 2 : this.groups.length;
    const totalWidth = columns * width + (columns - 1) * gap;
    const startX = (320 - totalWidth) / 2;
    const groupObjects = new Map<string, Array<Phaser.GameObjects.Rectangle | Phaser.GameObjects.Text>>();
    this.groups.forEach((group, index) => {
      const color = colors[index % colors.length] ?? 0xf4c955;
      groupObjects.set(group.id, this.createGroup(
        startX + (index % columns) * (width + gap),
        staffLayout ? 10 + Math.floor(index / columns) * 62 : 18,
        width, staffLayout ? 56 : 98,
        group.name.toLocaleUpperCase('pt-BR').slice(0, 15), group.count, color, group.symbol,
      ));
    });

    const conveyor = this.add.rectangle(160, 158, 292, 28, 0x203c49).setStrokeStyle(3, 0x6d8790);
    const parcel = this.add.rectangle(34, 158, 18, 18, 0xd7a753).setStrokeStyle(2, 0xffe2a0);
    for (let x = 58; x < 294; x += 30) this.add.circle(x, 158, 4, 0x89a3a4);

    const offGroup = this.bridge.on('challenge:group-revealed', ({ groupId }) => {
      const objects = groupObjects.get(groupId);
      if (!objects) return;
      objects.forEach((object) => object.setAlpha(1));
      if (!reducedMotion) this.tweens.add({ targets: objects, scale: 1.05, duration: 100, yoyo: true, ease: 'Stepped', easeParams: [2] });
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
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { offGroup(); offAnswer(); offCompleted(); });
    this.bridge.emit('scene:ready', undefined);
  }

  private createGroup(x: number, y: number, width: number, height: number, label: string, count: number, color: number, symbol?: string) {
    const objects: Array<Phaser.GameObjects.Rectangle | Phaser.GameObjects.Text> = [];
    objects.push(this.add.rectangle(x + width / 2, y + height / 2, width, height, 0x193744).setStrokeStyle(2, color));
    objects.push(this.add.text(x + 5, y + 5, symbol ? `${symbol}  ${label}` : label, { fontFamily: 'monospace', fontSize: '8px', color: '#f7f2e5' }));
    const columns = Math.min(count, symbol ? 4 : width < 110 ? 3 : 2);
    const cellWidth = (width - 12) / columns;
    const rows = Math.ceil(count / columns);
    const cellHeight = Math.min(24, (height - (symbol ? 18 : 30)) / Math.max(rows, 1));
    for (let index = 0; index < count; index += 1) {
      const column = index % columns;
      const row = Math.floor(index / columns);
      if (symbol) {
        const personX = x + 6 + (column + 0.5) * cellWidth;
        const personY = y + 17 + (row + 0.5) * cellHeight;
        objects.push(
          this.add.rectangle(personX, personY - 4, 5, 5, color),
          this.add.rectangle(personX, personY + 2, 10, 6, color),
        );
        continue;
      }
      const vehicle = this.add.rectangle(
        x + 6 + column * cellWidth + cellWidth / 2,
        y + 28 + row * cellHeight + cellHeight / 2,
        Math.max(14, cellWidth - 8), 13, color,
      ).setStrokeStyle(2, 0x112938);
      objects.push(vehicle);
    }
    objects.forEach((object) => object.setAlpha(0.28));
    return objects;
  }
}
