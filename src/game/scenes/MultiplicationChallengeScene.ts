import Phaser from 'phaser';
import { completeRobotLegs, getMultiplicationArtId, getRobotPartShapes, unselectedRobotColor, type Shape } from '../completeRobotParts';
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

    if (this.challenge.visual === 'complete-robot') {
      this.createCompleteRobot(reducedMotion);
      return;
    }

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
        const path = this.add.graphics().setPosition(x + 13, 95);
        stageIndicators.set(stage.id, [panel, label, count, choice, path]);
        count.setY(75);
        choice.setY(137);
      });
      platform = this.add.rectangle(160, 169, 292, 18, 0x203c49).setStrokeStyle(2, 0x6d8790);
      answerLabel = this.add.text(160, 169, 'ESCOLHA UM CAMINHO EM CADA SETOR', { fontFamily: 'monospace', fontSize: '8px', color: '#d3e0e2' }).setOrigin(0.5);
    } else {
      this.add.text(12, 10, 'LINHA DE MONTAGEM', { fontFamily: 'monospace', fontSize: '10px', color: '#d3e0e2' });
      platform = this.add.rectangle(160, 158, 286, 28, 0x203c49).setStrokeStyle(3, 0x6d8790);
      const parts = this.add.graphics();
      const selection = new Map<string, string>();
      const draw = () => {
        parts.clear();
        const shapes = this.challenge.stages.flatMap((stage, index) => {
          const variant = stage.options.findIndex(({ id }) => id === selection.get(stage.id));
          if (index > 0 && variant < 0) return [];
          return getRobotPartShapes(getMultiplicationArtId(stage.id, this.challenge.visual), Math.max(0, variant),
            stage.options[variant]?.color ?? unselectedRobotColor);
        });
        this.drawShapes(parts, shapes);
      };
      draw();
      answerLabel = this.add.text(160, 158, 'ESCOLHA AS PEÇAS', { fontFamily: 'monospace', fontSize: '8px', color: '#b9cdd1' }).setOrigin(0.5);
      stageIndicators.set('robot', [parts]);
      offStage = this.bridge.on('challenge:stage-selected', ({ stageId, optionId }) => {
        selection.set(stageId, optionId);
        draw();
        if (selection.size === this.challenge.stages.length) answerLabel.setText('MODELO CONFIGURADO');
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
        const path = objects[4];
        if (path instanceof Phaser.GameObjects.Graphics) {
          path.clear();
          this.drawShapes(path, getRobotPartShapes(stageId, stage.options.indexOf(option), option.color ?? '#71dfda'));
        }
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
        this.tweens.add({ targets: [...stageIndicators.values()].flat(), x: 90, duration: 650, ease: 'Stepped', easeParams: [10] });
      }
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { offStage(); offAnswer(); offCompleted(); });
    this.bridge.emit('scene:ready', undefined);
  }

  private drawShapes(parts: Phaser.GameObjects.Graphics, shapes: readonly Shape[]) {
    for (const shape of shapes) {
      const color = Phaser.Display.Color.HexStringToColor(shape.color).color;
      switch (shape.kind) {
        case 'rect':
          parts.fillStyle(color);
          if (shape.radius) parts.fillRoundedRect(shape.x, shape.y, shape.width, shape.height, shape.radius);
          else parts.fillRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case 'line':
          parts.lineStyle(shape.weight, color).lineBetween(shape.x, shape.y, shape.endX, shape.endY);
          break;
        case 'circle':
          parts.fillStyle(color).fillCircle(shape.x, shape.y, shape.radius);
          break;
      }
    }
  }

  private createCompleteRobot(reducedMotion: boolean) {
    const labelStyle = { fontFamily: 'monospace', fontSize: '10px', color: '#d3e0e2' };
    this.add.text(12, 10, 'LINHA DE MONTAGEM', labelStyle);
    const platform = this.add.rectangle(160, 166, 286, 25, 0x203c49).setStrokeStyle(2, 0x6d8790);
    const label = this.add.text(160, 166, 'EXPERIMENTE AS PEÇAS', labelStyle).setOrigin(0.5);
    const parts = this.add.graphics();
    const selection = new Map<string, string>();

    const drawRobot = (variation = 0, celebrating = false) => {
      parts.clear();
      const appearance = new Map(this.challenge.stages.map(({ id, options }) => {
        const selectedIndex = options.findIndex((option) => option.id === selection.get(id));
        const variant = (Math.max(0, selectedIndex) + variation) % options.length;
        const color = selectedIndex < 0 ? unselectedRobotColor : options[variant]?.color ?? '#71dfda';
        return [id, { variant, color }] as const;
      }));
      const bodyVariant = appearance.get('corpo')?.variant ?? 0;
      const shapes = [...completeRobotLegs, ...['bracos', 'corpo', 'sensores', 'cabeca'].flatMap((stageId) => {
        const part = appearance.get(stageId);
        return part ? getRobotPartShapes(stageId, part.variant, part.color, bodyVariant, celebrating) : [];
      })];
      this.drawShapes(parts, shapes);
    };

    drawRobot();
    const offStage = this.bridge.on('challenge:stage-selected', ({ stageId, optionId }) => {
      selection.set(stageId, optionId);
      drawRobot();
    });
    const offAnswer = this.bridge.on('challenge:answer-evaluated', ({ correct }) => {
      if (!correct && !reducedMotion) this.cameras.main.flash(140, 176, 58, 58);
    });
    const offCompleted = this.bridge.on('challenge:completed', () => {
      platform.setFillStyle(0x285b58);
      label.setText(this.challenge.equation.replace('?', String(this.challenge.correctAnswer))).setColor('#f4c955');
      if (reducedMotion) {
        drawRobot(0, true);
        return;
      }
      let frame = 0;
      this.time.addEvent({
        delay: 130, repeat: 5,
        callback: () => {
          frame += 1;
          drawRobot(frame === 6 ? 0 : frame, frame === 6);
        },
      });
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { offStage(); offAnswer(); offCompleted(); });
    this.bridge.emit('scene:ready', undefined);
  }
}
