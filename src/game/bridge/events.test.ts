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
