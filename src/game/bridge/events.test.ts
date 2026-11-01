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
