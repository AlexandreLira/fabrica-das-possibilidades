import Phaser from 'phaser';
import type { RobotBodyId } from '../../content/challenges';
import type { GameBridge } from '../bridge/events';

export class MultiplicationChallengeScene extends Phaser.Scene {
  constructor(private readonly bridge: GameBridge) { super('multiplication-challenge'); }

  create() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grid = this.add.graphics().lineStyle(1, 0x244251, 1);
    for (let x = 0; x <= 320; x += 16) grid.lineBetween(x, 0, x, 190);
    for (let y = 0; y <= 190; y += 16) grid.lineBetween(0, y, 320, y);

    this.add.text(12, 10, 'LINHA DE MONTAGEM', { fontFamily: 'monospace', fontSize: '10px', color: '#d3e0e2' });
    const platform = this.add.rectangle(160, 158, 286, 28, 0x203c49).setStrokeStyle(3, 0x6d8790);
    const body = this.add.rectangle(160, 99, 68, 58, 0x38505d).setStrokeStyle(4, 0x081c26).setAlpha(0.45);
    const eye = this.add.rectangle(160, 98, 22, 9, 0x112938).setAlpha(0.45);
    const antenna = this.add.text(160, 42, '?', { fontFamily: 'monospace', fontSize: '36px', color: '#f4c955' }).setOrigin(0.5).setAlpha(0.45);
    const label = this.add.text(160, 134, 'ESCOLHA AS PEÇAS', { fontFamily: 'monospace', fontSize: '8px', color: '#b9cdd1' }).setOrigin(0.5);
    const colors: Record<RobotBodyId, number> = { ciano: 0x71dfda, amarela: 0xf4c955, coral: 0xef7d72 };

    const offRobot = this.bridge.on('challenge:robot-configured', ({ bodyId, antennaId }) => {
      body.setFillStyle(colors[bodyId]).setAlpha(1);
      eye.setAlpha(1);
      antenna.setText(antennaId === 'dupla' ? 'Y' : '│').setAlpha(1);
      label.setText('MODELO CONFIGURADO');
      if (!reducedMotion) this.tweens.add({ targets: [body, eye, antenna], scale: 1.06, duration: 100, yoyo: true, ease: 'Stepped', easeParams: [2] });
    });
    const offAnswer = this.bridge.on('challenge:answer-evaluated', ({ correct }) => {
      if (!correct && !reducedMotion) this.cameras.main.flash(140, 176, 58, 58);
      if (correct) platform.setFillStyle(0x285b58);
    });
    const offCompleted = this.bridge.on('challenge:completed', () => {
      label.setText('6 MODELOS POSSÍVEIS').setColor('#71dfda');
      platform.setFillStyle(0x285b58);
      if (!reducedMotion) this.tweens.add({ targets: [body, eye, antenna], x: 250, duration: 650, ease: 'Stepped', easeParams: [10] });
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { offRobot(); offAnswer(); offCompleted(); });
    this.bridge.emit('scene:ready', undefined);
  }
}
