import { expect, it } from 'vitest';
import { createGameBridge } from './events';
it('entrega eventos apenas aos ouvintes ativos e permite limpar a sessão', () => {
  const bridge = createGameBridge(); const received: string[] = [];
  const off = bridge.on('bot:greeted', ({ message }) => received.push(message));
  bridge.emit('bot:greeted', { message: 'Olá!' }); off(); off();
  bridge.emit('bot:greeted', { message: 'Não receber' });
  bridge.on('bot:greeted', ({ message }) => received.push(message)); bridge.clear();
  bridge.emit('bot:greeted', { message: 'Também não' });
  expect(received).toEqual(['Olá!']);
});

it('emite eventos da fase apenas enquanto os listeners estão inscritos', () => {
  const bridge = createGameBridge();
  const routes: string[] = [];
  const answers: Array<{ answer: number; correct: boolean }> = [];
  let completions = 0;

  const offRoute = bridge.on('challenge:route-revealed', ({ routeId }) => routes.push(routeId));
  const offAnswer = bridge.on('challenge:answer-evaluated', (result) => answers.push(result));
  const offCompleted = bridge.on('challenge:completed', () => { completions += 1; });

  bridge.emit('challenge:route-revealed', { routeId: 'local' });
  bridge.emit('challenge:answer-evaluated', { answer: 12, correct: false });
  bridge.emit('challenge:completed', undefined);
  offRoute(); offAnswer(); offCompleted();
  bridge.emit('challenge:route-revealed', { routeId: 'express' });
  bridge.emit('challenge:answer-evaluated', { answer: 7, correct: true });
  bridge.emit('challenge:completed', undefined);

  expect(routes).toEqual(['local']);
  expect(answers).toEqual([{ answer: 12, correct: false }]);
  expect(completions).toBe(1);
});

it('tipa e remove os eventos visuais de montagem e distribuição', () => {
  const bridge = createGameBridge();
  const robots: string[] = [];
  const distributions: string[] = [];
  let resets = 0;

  const offRobot = bridge.on('challenge:robot-configured', ({ bodyId, antennaId }) => robots.push(`${bodyId}:${antennaId}`));
  const offItem = bridge.on('challenge:item-placed', ({ boxIndex, counts, remaining }) => distributions.push(`${boxIndex}:${counts.join('-')}:${remaining}`));
  const offReset = bridge.on('challenge:distribution-reset', () => { resets += 1; });

  bridge.emit('challenge:robot-configured', { bodyId: 'ciano', antennaId: 'haste' });
  bridge.emit('challenge:item-placed', { boxIndex: 1, counts: [3, 2, 2], remaining: 0 });
  bridge.emit('challenge:distribution-reset', undefined);
  offRobot(); offItem(); offReset();
  bridge.emit('challenge:robot-configured', { bodyId: 'coral', antennaId: 'dupla' });

  expect(robots).toEqual(['ciano:haste']);
  expect(distributions).toEqual(['1:3-2-2:0']);
  expect(resets).toBe(1);
});
