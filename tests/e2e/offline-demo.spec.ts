import { expect, test } from '@playwright/test';

test('mantém as três fases disponíveis offline com som desligado', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Silenciar efeitos sonoros' }).click();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  for (const [route, title] of [
    ['adicao-1', 'Pedido com rota alternativa'],
    ['multiplicacao-1', 'Monte o robô'],
    ['casas-de-pombo-1', 'Organize o depósito'],
  ] as const) {
    await page.goto(`/#/desafios/${route}`);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expect(page.locator('.challenge-game canvas')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Ativar efeitos sonoros' })).toBeVisible();
  }
});
