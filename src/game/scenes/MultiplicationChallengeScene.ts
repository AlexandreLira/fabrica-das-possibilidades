import Phaser from 'phaser';
import type { MultiplicationChallengeDefinition } from '../../content/challenges';
import type { GameBridge } from '../bridge/events';

export class MultiplicationChallengeScene extends Phaser.Scene {
  constructor(
    private readonly bridge: GameBridge,
    private readonly challenge: MultiplicationChallengeDefinition,
  ) { super('multiplication-challenge'); }

  create() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grid = this.add.graphics().lineStyle(1, 0x244251, 1);
    for (let x = 0; x <= 320; x += 16) grid.lineBetween(x, 0, x, 190);
    for (let y = 0; y <= 190; y += 16) grid.lineBetween(0, y, 320, y);

    let platform: Phaser.GameObjects.Rectangle;
    let answerLabel: Phaser.GameObjects.Text;
    let offStage: () => void = () => {};
    const stageIndicators = new Map<string, Phaser.GameObjects.GameObject[]>();
    if (this.challenge.visual === 'routes') {
      this.add.text(10, 10, 'CAMINHOS DA FÁBRICA', { fontFamily: 'monospace', fontSize: '9px', color: '#d3e0e2' });
      const stages = this.challenge.stages;
      stages.forEach((stage, index) => {
        const x = 12 + index * 103;
        const panel = this.add.rectangle(x + 44, 98, 86, 102, 0x193744).setStrokeStyle(2, 0x71dfda);
        const label = this.add.text(x + 44, 57, stage.name.toLocaleUpperCase('pt-BR'), { fontFamily: 'monospace', fontSize: '8px', color: '#f7f2e5' }).setOrigin(0.5);
        const count = this.add.text(x + 44, 91, `${stage.options.length} CAMINHOS`, { fontFamily: 'monospace', fontSize: '8px', color: '#f4c955' }).setOrigin(0.5);
        const choice = this.add.text(x + 44, 124, 'ESCOLHA', { fontFamily: 'monospace', fontSize: '8px', color: '#b9cdd1' }).setOrigin(0.5);
        this.add.text(x + 89, 98, index === stages.length - 1 ? '★' : '→', { fontFamily: 'monospace', fontSize: '13px', color: '#71dfda' }).setOrigin(0.5);
        stageIndicators.set(stage.id, [panel, label, count, choice]);
      });
      platform = this.add.rectangle(160, 169, 292, 18, 0x203c49).setStrokeStyle(2, 0x6d8790);
      answerLabel = this.add.text(160, 169, 'ESCOLHA UM CAMINHO EM CADA SETOR', { fontFamily: 'monospace', fontSize: '8px', color: '#d3e0e2' }).setOrigin(0.5);
    } else {
      this.add.text(12, 10, 'LINHA DE MONTAGEM', { fontFamily: 'monospace', fontSize: '10px', color: '#d3e0e2' });
      platform = this.add.rectangle(160, 158, 286, 28, 0x203c49).setStrokeStyle(3, 0x6d8790);
      const bodyStage = this.challenge.stages[0]!;
      const accessoryStage = this.challenge.stages[1]!;
      const body = this.add.rectangle(160, 99, 68, 58, 0x38505d).setStrokeStyle(4, 0x081c26).setAlpha(0.45);
      const eye = this.add.rectangle(160, 98, 22, 9, 0x112938).setAlpha(0.45);
      const accessory = this.add.text(160, 42, '?', { fontFamily: 'monospace', fontSize: '36px', color: '#f4c955' }).setOrigin(0.5).setAlpha(0.45);
      answerLabel = this.add.text(160, 134, 'ESCOLHA AS PEÇAS', { fontFamily: 'monospace', fontSize: '8px', color: '#b9cdd1' }).setOrigin(0.5);
      stageIndicators.set(bodyStage.id, [body, eye]);
      stageIndicators.set(accessoryStage.id, [accessory]);
      offStage = this.bridge.on('challenge:stage-selected', ({ stageId, optionId }) => {
        const stageIndex = this.challenge.stages.findIndex((stage) => stage.id === stageId);
        const option = this.challenge.stages[stageIndex]?.options.find((candidate) => candidate.id === optionId);
        if (!option) return;
        if (stageIndex === 0) body.setFillStyle(Phaser.Display.Color.HexStringToColor(option.color ?? '#71dfda').color).setAlpha(1);
        if (stageIndex === 1) accessory.setText(option.symbol ?? (this.challenge.stages.length > 1 ? '●' : '?')).setAlpha(1);
        eye.setAlpha(1);
        answerLabel.setText('MODELO CONFIGURADO');
        if (!reducedMotion) this.tweens.add({ targets: stageIndicators.get(stageId) ?? [], scale: 1.06, duration: 100, yoyo: true, ease: 'Stepped', easeParams: [2] });
      });
    }

    if (this.challenge.visual === 'routes') {
      offStage = this.bridge.on('challenge:stage-selected', ({ stageId, optionId }) => {
        const stage = this.challenge.stages.find((candidate) => candidate.id === stageId);
        const option = stage?.options.find((candidate) => candidate.id === optionId);
        if (!stage || !option) return;
        const objects = stageIndicators.get(stageId) ?? [];
        const panel = objects[0];
        if (panel instanceof Phaser.GameObjects.Rectangle) panel.setFillStyle(0x285b58).setStrokeStyle(2, 0xf4c955);
        const choice = objects[3];
        if (choice instanceof Phaser.GameObjects.Text) choice.setText(option.name.toLocaleUpperCase('pt-BR').slice(0, 12)).setColor('#71dfda');
        if (!reducedMotion) this.tweens.add({ targets: objects, scale: 1.04, duration: 90, yoyo: true, ease: 'Stepped', easeParams: [2] });
      });
    }
    const offAnswer = this.bridge.on('challenge:answer-evaluated', ({ correct }) => {
      if (!correct && !reducedMotion) this.cameras.main.flash(140, 176, 58, 58);
      if (correct) platform.setFillStyle(0x285b58);
    });
    const offCompleted = this.bridge.on('challenge:completed', () => {
      const resultLabel = this.challenge.visual === 'routes' ? 'TRAJETOS POSSÍVEIS' : 'MODELOS POSSÍVEIS';
      answerLabel.setText(`${this.challenge.correctAnswer} ${resultLabel}`).setColor('#71dfda');
      platform.setFillStyle(0x285b58);
      if (this.challenge.visual === 'robot' && !reducedMotion) {
        this.tweens.add({ targets: [...stageIndicators.values()].flat(), x: 250, duration: 650, ease: 'Stepped', easeParams: [10] });
      }
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { offStage(); offAnswer(); offCompleted(); });
    this.bridge.emit('scene:ready', undefined);
  }
}
