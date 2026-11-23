import { expect, test } from '@playwright/test';

test('mantém as quinze fases disponíveis offline com som desligado', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Silenciar efeitos sonoros' }).click();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  for (const [route, title] of [
    ['adicao-1', 'Pedido com rota alternativa'],
    ['adicao-2', 'Separação de Produtos'],
    ['adicao-3', 'Escolha de Materiais'],
    ['adicao-4', 'A Grande Produção'],
    ['adicao-5', 'Certificação Tripla'],
    ['multiplicacao-1', 'Monte o robô'],
    ['multiplicacao-2', 'Montagem de Robôs'],
    ['multiplicacao-3', 'Caminhos da Fábrica'],
    ['multiplicacao-4', 'Robô Completo'],
    ['multiplicacao-5', 'Código do Cofre'],
    ['casas-de-pombo-1', 'Organize o depósito'],
    ['casas-de-pombo-2', 'O Armazém no Limite'],
    ['casas-de-pombo-3', 'O Controle de Qualidade'],
    ['casas-de-pombo-4', 'Operação Linha de Produção'],
    ['casas-de-pombo-5', 'Depósito Crítico'],
  ] as const) {
    await page.goto(`/#/desafios/${route}`);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    if (route === 'adicao-5') {
      await page.getByRole('button', { name: 'Examinar NR-10' }).click();
      await expect(page.getByRole('button', { name: 'Yara Repetido' })).toBeVisible();
    } else if (route === 'multiplicacao-5') {
      for (const key of ['A', '1', '2', '0']) await page.getByRole('button', { name: key, exact: true }).click();
      await page.getByRole('button', { name: 'Testar código' }).click();
      await expect(page.getByText('Código válido. Todas as regras foram atendidas.')).toBeVisible();
    } else if (route === 'casas-de-pombo-5') {
      await page.getByRole('button', { name: 'Retirar peça' }).click();
      await expect(page.getByText('1 peça retirada', { exact: true })).toBeVisible();
    } else {
      await expect(page.locator('.challenge-game canvas')).toHaveCount(1);
    }
    await expect(page.getByRole('button', { name: 'Ativar efeitos sonoros' })).toBeVisible();
  }
});
