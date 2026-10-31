import { expect, test } from '@playwright/test';

test('navega, lembra o som e mantém apenas um canvas após reentradas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Fábrica das Possibilidades' })).toBeVisible();
  await page.getByRole('button', { name: 'Silenciar efeitos sonoros' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Ativar efeitos sonoros' })).toBeVisible();
  await page.getByRole('link', { name: 'Como jogar' }).click();
  await page.getByRole('button', { name: 'Entendi, vamos lá' }).click();
  await expect(page.getByRole('heading', { name: 'Conheça os setores' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cumprimentar B.O.T.' })).toBeEnabled();
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.getByRole('button', { name: 'Cumprimentar B.O.T.' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Tudo pronto' })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Começar' }).click();
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Fábrica das Possibilidades' })).toBeVisible();
});

for (const width of [320, 390]) {
  test(`layout sem transbordamento com ${width}px e movimento reduzido`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const hash of ['', '#/instrucoes', '#/setores']) {
      await page.goto(`/${hash}`);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.screenshot({ path: `test-results/setores-${width}-${test.info().project.name}.png`, fullPage: true });
  });
}


test('teclado alcança controles e a rota recebe foco', async ({ page, browserName }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.keyboard.press(tab);
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  await page.keyboard.press(tab);
  await expect(page.getByRole('button', { name: 'Silenciar efeitos sonoros' })).toBeFocused();
  await page.getByRole('link', { name: 'Como jogar' }).click();
  await expect(page.locator('h1')).toBeFocused();
});

test('a aplicação e o motor ficam disponíveis offline após o primeiro carregamento', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Fábrica das Possibilidades');
  await page.getByRole('link', { name: 'Começar' }).click();
  await expect(page.getByRole('button', { name: 'Cumprimentar B.O.T.' })).toBeEnabled();
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('pular para o conteúdo mantém a tela atual', async ({ page }) => {
  await page.goto('/#/instrucoes');
  await page.getByRole('link', { name: 'Pular para o conteúdo' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page).toHaveURL(/#\/instrucoes$/);
});

test.describe('falhas sem interferência do cache offline', () => {
  test.use({ serviceWorkers: 'block' });
test('falha no carregamento do motor preserva navegação e conteúdo', async ({ page }) => {
  await page.route(/.*\/assets\/.*(?:engine|phaser).*\.js$/, route => route.abort());
  await page.goto('/#/setores');
  await expect(page.getByText('A apresentação animada está indisponível.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Princípio da Adição' })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(page.locator('h1')).toHaveText('Fábrica das Possibilidades');
});
test('falha do sprite usa a alternativa estática e não habilita a cena', async ({ page }) => {
  await page.route(/.*\/assets\/bot-.*\.svg$/, route => route.abort());
  await page.goto('/#/setores');
  await expect(page.getByText('A apresentação animada está indisponível.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cumprimentar B.O.T.' })).toBeDisabled();
  await expect(page.locator('.game-fallback img')).toBeVisible();
});

});
