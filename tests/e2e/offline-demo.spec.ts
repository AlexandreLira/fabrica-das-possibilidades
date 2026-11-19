import { expect, test } from '@playwright/test';

test('mantém as nove fases disponíveis offline com som desligado', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Silenciar efeitos sonoros' }).click();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  for (const [route, title] of [
    ['adicao-1', 'Pedido com rota alternativa'],
    ['adicao-2', 'Separação de Produtos'],
    ['adicao-3', 'Escolha de Materiais'],
    ['multiplicacao-1', 'Monte o robô'],
    ['multiplicacao-2', 'Montagem de Robôs'],
    ['multiplicacao-3', 'Caminhos da Fábrica'],
    ['casas-de-pombo-1', 'Organize o depósito'],
    ['casas-de-pombo-2', 'O Armazém no Limite'],
    ['casas-de-pombo-3', 'O Controle de Qualidade'],
  ] as const) {
    await page.goto(`/#/desafios/${route}`);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expect(page.locator('.challenge-game canvas')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Ativar efeitos sonoros' })).toBeVisible();
  }
});
